
const express = require("express");
const app = express();
const hbs = require("hbs")
const Employee = require("./model/Employee")
require("./db.connection")
const bodyParser = require("body-parser")


app.set("view engine", "hbs")
// const encode = bodyParser.urlencoded();
const encode = bodyParser.urlencoded({ extended: true });

app.use(express.static("/views/public"))
hbs.registerPartials("./views/partials")

app.get("/", async (req, res) => {
    try {
        const data = await Employee.find().sort({ _id: -1 })
        res.render("index", { data: data })
    }
    catch (error) {
        console.log(error)
        res.render("index", { data: [] })
    }

})

app.get("/insert", (req, res) => {
    res.render("insert", { error: {}, data: {} })
})

app.post("/insert", encode, async (req, res) => {
    try {
        var data = new Employee(req.body);
        await data.save();
        res.redirect("/");
    }
    catch (error) {
        console.log(error);

        // Extract validation error messages
        let errorMessage = {};
        if (error.errors) {
            error.errors.name ? errorMessage['name'] = error.errors.name.message : "";
            error.errors.email ? errorMessage['email'] = error.errors.email.message : "";
            error.errors.phone ? errorMessage['phone'] = error.errors.phone.message : "";
            error.errors.dsg ? errorMessage['dsg'] = error.errors.dsg.message : "";
            error.errors.salary ? errorMessage['salary'] = error.errors.salary.message : "";
            error.errors.city ? errorMessage['city'] = error.errors.city.message : "";
            error.errors.state ? errorMessage['state'] = error.errors.state.message : "";
        }

        // Render the insert view with error messages and user input
        res.render("insert", {
            errorMessage: errorMessage,
            formData: req.body, // Pass user input back to the form
            data: data
        });
    }
});

//search

app.get("/search", async (req, res) => {

    try {
        let search = req.query.q
        var data = await Employee.find({
            $or: [
                { name: { $regex: `/*${search}/*`, $options: "i" } },
                { email: { $regex: `/*${search}/*`, $options: "i" } },
                { city: { $regex: `/*${search}/*`, $options: "i" } },
                { state: { $regex: `/*${search}/*`, $options: "i" } },
            ]
        }).sort({ _id: -1 })
        res.render("index", { data: data })
    }
    catch (error) {
        console.log(error)
        res.render("index", { data: data })
    }
})

//delete

app.get("/delete/:_id", async (req, res) => {
    {
        try {
            const data = await Employee.findOne({ _id: req.params._id })
            await data.deleteOne();
            res.redirect("/")
        }
        catch (error) {
            console.log(error)
            res.redirect("/")
        }
    }
})



app.get("/edit/:_id", async (req, res) => {
    try {
        const data = await Employee.findOne({ _id: req.params._id });
        res.render("edit", { errorMessage: {}, data: data });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});


app.post("/edit/:_id", encode, async (req, res) => {
    try {
        var data = await Employee.findOne({ _id: req.params._id })
        //update fields asde on request body
        data.name = req.body.name ?? data.name
        data.dsg = req.body.dsg ?? data.dsg
        data.phone = req.body.phone ?? data.phone
        data.salary = req.body.salary ?? data.salary
        data.city = req.body.city ?? data.city
        data.state = req.body.state ?? data.state
        data.email = req.body.email ?? data.email

        // save
        await data.save();
        res.redirect("/")
    }
    catch (error) {
        console.log(error);

        // Extract validation error messages
        let errorMessage = {};
        if (error.errors) {
            error.errors.name ? errorMessage['name'] = error.errors.name.message : "";
            error.errors.email ? errorMessage['email'] = error.errors.email.message : "";
            error.errors.phone ? errorMessage['phone'] = error.errors.phone.message : "";
            error.errors.dsg ? errorMessage['dsg'] = error.errors.dsg.message : "";
            error.errors.salary ? errorMessage['salary'] = error.errors.salary.message : "";
            error.errors.city ? errorMessage['city'] = error.errors.city.message : "";
            error.errors.state ? errorMessage['state'] = error.errors.state.message : "";
        }

        // Render the insert view with error messages and user input
        res.render("edit", {
            errorMessage: errorMessage,
            formData: req.body, // Pass user input back to the form
            data: data
        });
    }
})

app.listen(8000, console.log("server is runninng"))

