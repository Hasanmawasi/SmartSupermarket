

export const dashboard = (req,res)=>{
    
        res.render("admin/dashboard",{
            layout:"./layouts/admin"
        })
};



export default dashboard;