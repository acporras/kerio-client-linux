const express = require('express')
const app = express()
const xml2js = require('xml2js')
const parseString = xml2js.parseString
const { exec, spawn } = require('child_process')

app.post("/status", (req, res) => {
    exec('systemctl | grep kerio-kvc', (err, stdout) => {
        if (err) {
            res.send({
                valid: false,
                message: err
            })
        } else {
            res.send({
                valid: true
            })
        }
    })
})

app.post("/disconnect", (req, res) => {
    exec('service kerio-kvc stop', (err, stdout) => {
        if (err) {
            res.send({
                valid: false,
                message: err
            })
        } else {
            res.send({
                valid: true
            })
        }
    })
})

app.post("/connect", (req, res) => {
    exec('service kerio-kvc start', (err, stdout) => {
        if (err) {
            res.send({
                valid: false,
                message: err
            })
        } else {
            res.send({
                valid: true
            })
        }
    })
})
app.post("/connections", (req, res) => {
    exec('cat /etc/kerio-kvc.conf', (err, stdout) => {
        if (err) {
            res.send({
                valid: false,
                message: err
            })
        } else {
            parseString(stdout, (err, result) => {
                if (err) {
                    res.send({
                        valid: false,
                        message: err
                    })
                } else {
                    res.send({
                        valid: true,
                        transaction: result
                    })
                }
            })
        }
    })
})

module.exports = {
    path: "/api/",
    handler: app
}