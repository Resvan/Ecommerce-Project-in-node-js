const adminHelper = require('../helpers/adminhelpers')
const passport = require('passport')
const { dailyRevenue, weeklyRevenue, yearlyRevenue, totalRevenue, totalUsers, getchartData } = require('../helpers/revenueHelpers')







module.exports = {
    
    viewLogin : (req, res) => {
        res.render('admin/login', {
            error: req.flash("error"),
        })
    },
    
    loginAdmin : passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true
    }),

    logoutAdmin : (req, res) => {
        req.session.passport.user = null
        res.redirect('/admin/login')
    },

    checkAuthenticated : (req, res, next) => {
        if (req.user) {
            return next()
        }

        res.redirect('/admin/login')
    },
    checkNotAuthenticated: (req, res, next) => {
        if (req.user) {
            return res.redirect('/admin')
        }
        next()
    },



    dashboardView: async (req, res) => {
        const revenueDaily= await  dailyRevenue()
        const revenueWeekly = await  weeklyRevenue()
        const revenueYearly= await  yearlyRevenue()
        const revenueTotal = await totalRevenue()
        const userCount = await totalUsers()
        res.locals.user = req.user
        res.render('admin/dashboard', { revenueDaily, revenueWeekly, revenueYearly, revenueTotal, userCount })
    },





    usersView : (req, res) => {
        adminHelper.getAllUser().then((users) => {
            res.locals.user = req.user
            res.render('admin/users', { users })
        })

    },


    blockUser : (req, res) => {
        let email = req.params.id
        adminHelper.userBlock(email).then(() => {
            res.redirect('/admin/users')
        })
    },

    unblockUser: (req, res) => {
        let email = req.params.id
        adminHelper.userUnblock(email).then(() => {
            res.redirect('/admin/users')
        })
    },





    categoryView: async (req, res) => {
        try {
            const category = await adminHelper.getAllCategory();
            res.locals.user = req.user;
            res.render('admin/category', { category, message: req.flash('message'), res: res });
        } catch (error) {
            console.log(error);
        }
    },


    viewAddCateogry: (req, res) => {
        res.locals.user = req.user
        res.render('admin/addCategory', { message: req.flash('message') })
    },

    addCategory: (req, res) => {
        adminHelper.categoryAdd(req.body).then((response) => {
            if (response.status) {
                res.redirect('/admin/category')
            } else {
                res.redirect('/admin/add-category')
                req.flash('message', response.error )
                
            }
        })
    },

    vieweditCategory: (req, res) => {
        let categId = req.params.id
        adminHelper.categoryEditview(categId).then((category) => {
            res.locals.user = req.user
            res.render('admin/editCategory',{category, message: req.flash('message')})
        })

        
    },

    editCategory: (req, res) => {
        let newCateg = req.body
        let id = newCateg.id
        adminHelper.categoryEdit(newCateg).then((response) => {
            if (response.status) {
                res.redirect('/admin/category')
            } else {
                req.flash('message', response.error)
                res.redirect('/admin/edit-category/'+id)
                
            }
        })

    },

    deleteCategory: (req, res) => {
        let categId = req.params.id
        adminHelper.Categorydelete(categId).then((response) => {
            req.flash('message', response.message)
            res.redirect('/admin/category')
            
        })
    },


    getDataForChart: (req, res) => {
        getchartData().then((obj) => {
            let result = obj.result
            let weeklyReport = obj.weeklyReport
            res.json({ data: result, weeklyReport })
        })
    }


    
}