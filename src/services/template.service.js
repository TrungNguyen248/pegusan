'use strict'

const templateModel = require('../models/template.model')
const { emailHtml } = require('../utils/tem_mail.html')

const newTemplate = async ({ tem_name, tem_id = 0, tem_html }) => {
    //1. check if template exists

    //2. create a new template
    const newTem = await templateModel.create({
        tem_name,
        tem_id,
        tem_html: emailHtml,
    })

    return newTem
}

const getTemplate = async ({ tem_name }) => {
    const template = await templateModel.findOne({
        tem_name,
    })

    return template
}

module.exports = {
    newTemplate,
    getTemplate,
}
