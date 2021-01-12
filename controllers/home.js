const { layout } = require("../layout")

const home = (req, res) => {
    res.render("home", {
        locals: {
            title: "Advocates Asia Home",
            errormsg: ""
        },
        ...layout,
    })
}

module.exports = {
    home
}