export function success(res, data) {
return res.status(200).json({
status: "ok",
data
});
}

export function fail(res, message, code = 500) {
return res.status(code).json({
status: "error",
error: message
});
}