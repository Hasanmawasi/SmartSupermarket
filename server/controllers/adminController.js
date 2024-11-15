

export const dashboard = (req,res)=>{
    
        res.render("admin/dashboard",{
            layout:"./layouts/admin"
        })
};
export const home = (req,res)=>{
    
        res.render("admin/home",{
            layout:"./layouts/home"
        })
};

export const products = (req,res)=>{
    
    res.render("admin/products",{
        layout:"./layouts/admin"
    })
};

export const forms = (req,res)=>{
    let form= req.query.form;
    res.render("admin/forms",{
        form: form,
        layout:"./layouts/admin"
    })
};

export const customers = (req, res)=>{
    res.render("admin/customers",{
        layout:"./layouts/admin"
    })
};

export const orders = (req, res)=>{
    res.render("admin/orders",{
        layout:"./layouts/admin"
    })
};

export const profit = (req, res)=>{
    res.render("admin/profit",{
        layout:"./layouts/admin"
    })
};

export const about = (req, res) => {

    res.render("admin/about", {
        layout:"./layouts/admin"
    })
}

export const reports = (req, res) => {
    res.render("admin/reports", {
        layout:"./layouts/admin"
    })
}

export const workers = (req, res) => {
    res.render("admin/workers", {
        layout:"./layouts/admin"
    })
}
export const profile = (req, res) => {
    res.render("admin/profile", {
        
    })
}


export default dashboard;