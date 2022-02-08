const Hospital = require("../models/Hospital.js");
//@desc Get all hospitals
//@route GET /api/v1/hospitalss
//@access Publice

exports.getHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find();
    res
      .status(200)
      .json({ success: true, count: hospitals.length, data: hospitals });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
//@desc Get single hospitals
//@route GET /api/v1/hospitals/:id
//@access Public

exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true, msg: `Get hospital ${req.params.id}` });
};
//@desc Create a hospitals
//@route  /api/v1/hospitals

exports.createHospital = async (req, res, next) => {
  console.log(req.body);
  const hospital = await Hospital.create(req.body);
  res.status(200).json({ success: true, data: hospital });
};
//@desc put single hospitals
//@route GET /api/v1/hospitals
//@access Publice

exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hospital) {
      return res.status(400).json({ success: false });
    }
    res
      .status(200)
      .json({
        success: true,
        msg: `Update hospital ${req.params.id}`,
        data: hospital,
      });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc delete single hospitals
//@route GET /api/v1/hospitals
//@access Pivate

exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
