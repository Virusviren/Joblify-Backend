import mongoose from 'mongoose';

const AdminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  roleIsAdmin: {
    type: Boolean,
    require: true,
    default: true,
  },
});
const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
