export const about = (req, res) => {
    res.render('worker/about', {
        layout:"./layouts/worker"
    })
};

export const home = (req, res) => {
    res.render('worker/home', {
        layout: "./layouts/workerHome"
    })
}

export const log = (req, res) => {
    res.render('worker/daily-log', {
        layout: "./layouts/worker"
    })
}

export const reports = (req, res) => {
    res.render('worker/reports', {
        layout:'./layouts/worker'
    })
}
export const profile = (req, res) => {
    res.render('worker/profile', {
        layout:'./layouts/worker'
    })
}
