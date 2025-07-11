const axios = require("axios");
const generatePaysprintJWT = require("../../services/Dmt&Aeps/TokenGenrate.js");
const BbpsHistory = require("../../models/bbpsModel.js");
const PayOut = require("../../models/payOutModel.js");
const Transaction = require("../../models/transactionModel.js");
const userModel = require("../../models/userModel.js");
const mongoose = require("mongoose");
const { getApplicableServiceCharge, applyServiceCharges, logApiCall } = require("../../utils/chargeCaluate.js");
const { distributeCommission } = require("../../utils/distributerCommission.js");

const generateReferenceId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `REF${timestamp}${randomStr}`.toUpperCase();
};

exports.hlrCheck = async (req, res, next) => {
  const token = generatePaysprintJWT();
  const headers = { Token: token, "Content-Type": "application/json" };
  const { number, type } = req.body;
  try {
    const apiUrl = "https://api.paysprint.in/api/v1/service/recharge/hlrapi/hlrcheck";
    const requestData = { number, type };
    const response = await axios.post(apiUrl, requestData, { headers });
    logApiCall({ url: apiUrl, requestData, responseData: response.data });
    return res.status(200).json({ data: response.data });
  } catch (error) {
    next(error);
  }
};

exports.browsePlan = async (req, res, next) => {
  const token = generatePaysprintJWT();
  const headers = { Token: token, "Content-Type": "application/json" };
  const { circle, op } = req.query;
  try {
    const apiUrl = "/recharge/hlrapi/browseplan";
    const requestData = { circle, op };
    const response = await axios.post(apiUrl, requestData, { headers });
    logApiCall({ url: apiUrl, requestData, responseData: response.data });
    return res.status(200).json({ data: response.data });
  } catch (error) {
    next(error);
  }
};

exports.dthPlan = async (req, res, next) => {
  const token = generatePaysprintJWT();
  const headers = { Token: token, "Content-Type": "application/json" };
  const { canumber, op } = req.body;
  try {
    const apiUrl = "https://api.paysprint.in/api/v1/service/recharge/hlrapi/dthinfo";
    const requestData = { canumber, op };
    const response = await axios.post(apiUrl, requestData, { headers });
    logApiCall({ url: apiUrl, requestData, responseData: response.data });
    return res.status(200).json(response.data);
  } catch (error) {
    return next(error);
  }
};

exports.getOperatorList = async (req, res, next) => {
  const token = generatePaysprintJWT();
  const headers = { Token: token, "Content-Type": "application/json" };
  const { mode = "offline" } = req.body;
  try {
    const apiURL = "https://api.paysprint.in/api/v1/service/recharge/recharge/getoperator";
    const response = await axios.post(apiURL, { mode }, { headers });
    logApiCall({ url: apiURL, requestData: req.body, responseData: response.data });
    if (response.data?.responsecode === 1) {
      return res.status(200).json({ status: "success", message: "Operator List Fetched", data: response.data.data });
    } else {
      return res.status(200).json({ status: "success", message: "No Operator Found", data: [] });
    }
  } catch (error) {
    next(error);
  }
};

exports.checkRechargeStatus = async (req, res, next) => {
  const token = generatePaysprintJWT();
  const headers = { Token: token, "Content-Type": "application/json" };
  const { transactionId } = req.params;
  try {
    const apiUrl = "https://api.paysprint.in/api/v1/service/recharge/recharge/status";
    const response = await axios.post(apiUrl, { referenceid: transactionId }, { headers });
    logApiCall({ url: apiUrl, requestData: req.params, responseData: response.data });
    const resData = response.data;
    if (resData.status === true) {
      const txnStatus = resData.data?.status;
      const statusMap = { 0: "failed", 1: "success", 2: "pending" };
      return res.status(200).json({ status: statusMap[txnStatus], data: resData.data });
    }
    return res.status(400).json({ status: "fail", data: resData });
  } catch (error) {
    next(error);
  }
};

exports.getBillOperatorList = async (req, res) => {
  const token = generatePaysprintJWT();
  const headers = { Token: token, "Content-Type": "application/json" };
  const { mode = "offline" } = req.body;
  const apiURL = "https://api.paysprint.in/api/v1/service/bill-payment/bill/getoperator";
  try {
    const response = await axios.post(apiURL, { mode }, { headers });
    logApiCall({ url: apiURL, requestData: req.body, responseData: response.data });
    if (response.data.response_code === 1) {
      return res.status(200).json(response.data);
    }
    if (response.data.response_code === 2) {
      return res.status(200).json(response.data);
    }
    return res.status(400).json(response.data);
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.response?.data?.message || "Failed", error: error.message });
  }
};

exports.fetchBillDetails = async (req, res) => {
  const token = generatePaysprintJWT();
  const headers = { Token: token, "Content-Type": "application/json" };
  const { operator, canumber, mode = "online", ...extraFields } = req.body;
  if (!operator || !canumber) {
    return res.status(400).json({ status: "fail", message: "Missing required fields" });
  }
  try {
    const response = await axios.post("https://api.paysprint.in/api/v1/service/bill-payment/bill/fetchbill", { operator, canumber, mode, ...extraFields }, { headers });
    logApiCall({ url: "fetchbill", requestData: req.body, responseData: response.data });
    if (response.data.response_code === 1) {
      return res.status(200).json({ ...response.data, status: "success" });
    }
    return res.status(400).json({ ...response.data, status: "fail" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.response?.data?.message || "Failed", error: error.message });
  }
};

exports.checkBillPaymentStatus = async (req, res, next) => {
  const token = generatePaysprintJWT();
  const headers = { Token: token, "Content-Type": "application/json" };
  const { referenceid } = req.body;
  if (!referenceid) {
    return res.status(400).json({ status: "fail", message: "Missing referenceid" });
  }
  try {
    const response = await axios.post("https://api.paysprint.in/api/v1/service/bill-payment/bill/status", { referenceid }, { headers });
    logApiCall({ url: "status", requestData: req.body, responseData: response.data });
    if (response.data.status === true) {
      const txnStatus = response.data.data?.status;
      const statusMap = { 0: "failed", 1: "success", 2: "pending" };
      return res.status(200).json({ status: statusMap[txnStatus], data: response.data.data });
    }
    return res.status(400).json({ status: "fail", data: response.data });
  } catch (error) {
    return next(error);
  }
};
