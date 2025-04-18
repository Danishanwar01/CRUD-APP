
const mongoose = require("mongoose")

const EmployeeSchma = mongoose.Schema({

    name:{
        type:String,
        required:[true,"Name field is mandatory"]
    },
    email:{

        type:String,
        required:[true,"Email field is mandatory"]
    },
    phone:{

        type:Number,
        required:[true,"phone field is mandatory"]
    },
    dsg:{

        type:String,
        required:[true,"Designation field is mandatory"]
    },
    salary:{

        type:Number,
        required:[true,"Salary field is mandatory"]
    },
    city:{

        type:String,
        required:[true,"City field is mandatory"]
    },
    state:{

        type:String,
        required:[true,"State field is mandatory"]
    },
})

const Employee = new mongoose.model("Employee",EmployeeSchma)
module.exports = Employee