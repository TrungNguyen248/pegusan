'use strict'

const emailHtml = `
<html>
<header>
    <title>Template email</title>
</header>
<body>
    <h3>Thanks for resign</h3>
    <p>Please click button below to verify your email</p>
    <a href="{{link_verify}}">Click here</a>
</body>
</html>
`

module.exports = {
    emailHtml,
}
