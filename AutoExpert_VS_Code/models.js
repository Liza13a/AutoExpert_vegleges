// Modellek egy autó szerviz rendszerhez
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//Users
const carConfigSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  engine_type: { type: String, required: true }
}, { timestamps: true });


// RepairShop – szervizek adatai
const repairShopSchema = new mongoose.Schema({
  _id: { type: Number, required: true }, 
  name: { type: String, required: true }, 
  address: { type: String, required: true }, 
  phone_number: { type: String, required: true } 
});


// Employee – alkalmazottak
const employeeSchema = new mongoose.Schema({
  _id: { type: Number, required: true }, 
  repair_shop_id: { type: Number, required: true }, 
  full_name: { type: String, required: true }, 
  position: { type: String, required: true } 
});

//Service Record - szerviztörténetek 
const serviceRecordSchema = new mongoose.Schema({
  car_config_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CarConfig', required: true },
  repair_shop_id: { type: Number, ref: 'RepairShop', required: true },  
  employee_id: { type: Number, ref: 'Employee', required: true },        
  service_date: { type: Date, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true }
});


// User – felhasználók /belépés/regisztárció
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'] }, 

  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ] 
  },

  role: { type: String, enum: ['user', 'publisher'], default: 'user' }, 

  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false 
  },

  resetPasswordToken: String, 
  resetPasswordExpire: Date,  

  createdAt: { type: Date, default: Date.now } 
});


// Jelszó titkosítás mentés előtt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// JWT token generálás
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};


// Jelszó ellenőrzés
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Reset token generálás
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

  return resetToken;
};


// Modellek exportálása
module.exports.User = mongoose.model('User', userSchema);
module.exports.CarConfig = mongoose.model('CarConfig', carConfigSchema, 'car_configs');
module.exports.Employee = mongoose.model('Employee', employeeSchema, 'employees');
module.exports.RepairShop = mongoose.model('RepairShop', repairShopSchema, 'repair_shops');
module.exports.ServiceRecord = mongoose.model('ServiceRecord', serviceRecordSchema, 'service_records');