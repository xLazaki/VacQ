const Hospital = require("../models/Hospital.js");
const School = require("../models/School");
//@desc Get all hospitals
//@route GET /api/v1/hospitalss
//@access Publice

exports.getHospitals = async (req, res, next) => {
      console.log(req.query);
      let query;

      //Copy req.query
      const reqQuery={...req.query};

      //Fields to exclude
      const removeFields= ['select','sort','page','limit'];

      //Loop over remove fields and delte them from reqQuery
      removeFields.forEach(param=>delete reqQuery[param]);
      console.log(reqQuery);

      let queryStr = JSON.stringify(reqQuery);
      queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
      query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

      //Select Fields
      if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
      }

      //Sort
      if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      }else{
        query=query.sort('-createdAt');
      }
      //Pagination limit page
      const page= parseInt(req.query.page,10) || 1;
      const limit= parseInt(req.query.limit,10) || 25;
      const startIndex = (page-1)*limit;
      const endIndex = page*limit;
      
  try {
    const total = await Hospital.countDocuments();
      query = query.skip(startIndex).limit(limit);
      //execute query
    const hospitals = await query;
    //Pagination result
    const pagination={};

    if(endIndex<total){
      pagination.next={
        page:page+1,
        limit
      }
    }

    if(startIndex>0){
      pagination.prev={
        page:page-1,
        limit
      }
    }
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
      return res.status(404).json({ success: false ,message:`Bootcamp not found with id of ${req.params.id}`});
    }
    hospital.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};