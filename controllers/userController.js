const userAuth = require('../auth/userAuth')
const userHelper = require('../helpers/userHelpers')
const productHelper = require('../helpers/productHelper');
const adminHelper = require('../helpers/adminhelpers')
const otpAuthentication = require('../auth/otpAuthentication');
const { getCartCount } = require('../helpers/cartHelpers')
const { getUserDetails, addAddress, deleteAddress, editDetails, changePassword }= require('../helpers/userDetailsHelper');
const { startProductOffer }= require('../helpers/productOfferHelpers')
const { startCategoryOffer }= require('../helpers/categoryOfferHelper')


//OTP login




// User Home Page
const viewHome = async (req, res) => {
    await startProductOffer()
    await startCategoryOffer()
    const products = await productHelper.getProductHome()
    const category = await adminHelper.getAllCategory()
    res.locals.user = req.session.user
    let cartCount = 0
    if (req.session.user) {
        userId = req.session.user._id
        cartCount = await getCartCount(userId)
    }
    res.locals.category = category
    res.locals.cartCount = cartCount
    res.render('user/home',{products, category})
}




// Shop page 
const viewShop = (req, res) => {
    productHelper.getAllProduct().then(async(products) => {
        const category = await adminHelper.getAllCategory()
        let cartCount = 0
        if (req.session.user) {
            userId = req.session.user._id
            cartCount = await getCartCount(userId)
        }
        res.locals.category = category
        res.locals.user = req.session.user
        res.locals.cartCount = cartCount
        res.render('user/shop', {products, category})
    })
    
}



//productDetais





// login Page
const viewLogin = (req, res) => {
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.render('user/login', { message: req.flash('message') })
    }
        
   
}




// Login post
const loginUser = (req, res) => {
    userAuth.doLogin(req.body).then((response) => {
        if (response.status) {
            req.session.user = response.user
            res.redirect('/')
        }
    }).catch((response) => {
        req.flash('message', response.error)
        res.redirect('/login')
    })
}


const verifyLogin = (req, res, next) => {
    if (req.session.user) {
        return next()
    } else {
        return res.redirect('/login')
    }
}




//Logout
const logoutUser = (req, res) => {
    req.session.user = null
    res.redirect('/')
}





// signup Page
const viewSignup = (req, res) => {
    res.render('user/signup',{message: req.flash('message')})
}

const signupUser = (req, res) => {
    userHelper.secureUser(req.body).then((response) => {
        if (response.status) {
            res.redirect('/login')
        } else {
            req.flash('message', response.error)
            res.redirect('/signup')
        }
    })
    
}






const getOtp = async (req, res) => {
    let phone = req.body.phone;
    let user = await userHelper.findUserWithPhone(phone);
    if (user) {
        otpAuthentication
            .loginGetOtp(phone)
            .then(() => {
                res.render("user/otp-login", { phone });
            })
            .catch(() => {
                req.flash('message', "server busy try again later!!!")
                res.redirect("/login");
            });
    } else {
        req.flash('message', "No user with entered phone number !!!")
        res.redirect("/login");
    }
};




const verifyOtp = async (req, res) => {
    let phone = req.body.phone;
    let otp = req.body.otp;
    let user = await userHelper.findUserWithPhone(phone);
    otpAuthentication
        .loginVerifyOtp(phone, otp)
        .then((response) => {
            if (response.status) {
                req.session.user = user;
                res.redirect("/");
            } else {
                req.flash('message', "Entered otp does not match Try again !!!") 
                res.redirect("/login");
            }
        })
        .catch(() => {
            req.flash('message', "Server busy try again !!!") 
            res.redirect("/login");
        });
};


const viewMyAccount =async (req, res) => {
    const user = await getUserDetails(req.session.user._id)
    res.locals.user = req.session.user
    let cartCount = 0
    if (req.session.user) {
       const userId = req.session.user._id
        cartCount = await getCartCount(userId)
    }
    res.locals.cartCount = cartCount
    res.render('user/myAccount',{user})
}


const addUserAddress = (req, res) => {
    let userId = req.session.user._id
    addAddress(userId, req.body).then((response) => {
        if (response.success) {
            res.json({status:true})
        }
    })
}

const deleteUserAddress = (req, res) => {
    let userId = req.session.user._id
    deleteAddress(userId, req.body.addressId).then(() => {
        res.json({status:true})
    })
}

const editUserDetails = (req, res) => {
    const userId = req.session.user._id
    editDetails(userId, req.body).then(() => {
        res.json({success:true})
    }).catch((response) => {
        res.json({ emailExist: true})
    })
}

const changeUserPassword = (req, res) => {
    const userId = req.session.user._id
    changePassword(userId, req.body).then((response) => {
        res.json({success: true})
    }).catch(() => {
        res.json({sucess: false})
    })
}

const viewWalletHistory = async (req, res) => {
    const userId = req.session.user._id
    const user = await getUserDetails(userId)
    res.render('user/walletHistory', {user})
}


const viewAboutPage = (req, res) => {
    res.render('user/about')
}

const viewContactPage = (req, res) => {
    res.render('user/contact')
}

//Exporting function

module.exports = {
    viewHome, viewShop, viewSignup, signupUser, viewLogin,
    loginUser, logoutUser, verifyLogin, getOtp, verifyOtp,
    viewMyAccount, addUserAddress, deleteUserAddress,
    editUserDetails, changeUserPassword, viewWalletHistory,
    viewAboutPage, viewContactPage


}