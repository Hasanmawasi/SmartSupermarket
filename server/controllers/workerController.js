import db from "../config/db.js";

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

export const sendReport = async (req, res) => {
    const workerId =  req.user.worker_id;
    const branchId = req.user.branch_id;
    const report_title = req.body.reportTitle;
    const report_content = req.body.reportContent;
    const recipient = `${branchId}-admin`;
    const report_date = new Date().toISOString().slice(0, 10);

    if (!report_title || !report_content) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
       const result = await db.query("INSERT INTO reports(report_date, report_title, report_body, recipient, worker_id) VALUES ($1,$2,$3,$4,$5) RETURNING *", [report_date, report_title, report_content, recipient, workerId]);
       res.status(201).json({ message: "Report added successfully!", report: result.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Database error occurred!" });
    }
}