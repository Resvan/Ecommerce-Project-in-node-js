const Order = require("../models/orderModel");
const User = require("../models/userModel");

//daily revenue
const dailyRevenue = () => {
    return new Promise(async (resolve, reject) => {
        try {
            var now = new Date();
            var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let dailyRevenue = await Order.aggregate([
                {
                    $match: {
                        date: {
                            $gte: startOfToday
                        }
                    }
                },
                {
                    $match: {
                        status: "Delivered"
                    }

                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$total' }
                    }
                }

            ])
             //console.log(dailyRevenue);
            resolve(dailyRevenue[0].totalAmount)
        } catch {
            // console.log("haiiiiiiiiiii");
            resolve(0)
        }
    })
}

// weekly revenue
const weeklyRevenue = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let weeklyRevenue = await Order.aggregate([
                {
                    $match: {
                        date: {
                            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
                        }
                    }
                },
                {
                    $match: {
                        status: "Delivered"
                    }

                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$total' }
                    }
                }
            ])
            //console.log("weekly"+weeklyRevenue[0].totalAmount);
            resolve(weeklyRevenue[0].totalAmount)
        } catch {
            resolve(0)
        }

    })
}

// yearly revenue
const yearlyRevenue = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let yearlyRevenue = await Order.aggregate([
                {

                    $match: {
                        date: {
                            $gte: new Date(new Date() - 1000 * 60 * 60 * 24 * 7 * 4 * 12)
                        }
                    }
                },
                {
                    $match: {
                        status: "Delivered"
                    }

                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$total' }
                    }
                }

            ])
           //  console.log(yearlyRevenue[0].totalAmount);
            resolve(yearlyRevenue[0].totalAmount)
        } catch {
            resolve(0)
        }
    })
}

// total revenue
const totalRevenue = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let totalRevenue = await Order.aggregate([
                {
                    $match: {
                        status: "Delivered"
                    }

                },
                {
                    $project: {
                        totalAmount: "$total"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$totalAmount' }
                    }
                }
            ])
            resolve(totalRevenue[0].totalAmount)
        } catch {
            resolve(0)
        }
        
        
    })
}

// get chart data
const getchartData = () => {

    return new Promise((resolve, reject) => {


       Order.aggregate([
            { $match: { "status": "Delivered" } },
            {
                $project: {
                    date: { $convert: { input: "$_id", to: "date" } }, total: "$total"
                }
            },
            {
                $match: {
                    date: {
                        $lt: new Date(), $gt: new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 365))
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$total" }
                }
            },
            {
                $project: {
                    month: "$_id",
                    total: "$total",
                    _id: 0
                }
            }
        ]).then(result => {
            Order.aggregate([
                { $match: { "status": "Delivered" } },
                {
                    $project: {
                        date: { $convert: { input: "$_id", to: "date" } }, total: "$total"
                    }
                },
                {
                    $match: {
                        date: {
                            $lt: new Date(), $gt: new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 7))
                        }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$date" },
                        total: { $sum: "$total" }
                    }
                },
                {
                    $project: {
                        date: "$_id",
                        total: "$total",
                        _id: 0
                    }
                },
                {
                    $sort: { date: 1 }
                }
            ]).then(weeklyReport => {
                let obj = {
                    result, weeklyReport
                }
                resolve(obj)
            })
        })

    })
}

const totalUsers = () => {
    return new Promise(async(resolve, reject) => {
        const userCount = await User.find().count()
        resolve(userCount)
    })
}


module.exports = {
    dailyRevenue, weeklyRevenue, yearlyRevenue, getchartData, totalRevenue, totalUsers
}