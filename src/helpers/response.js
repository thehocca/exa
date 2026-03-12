exports.ok = (data) => ({
    status: 0,
    ...data
});

exports.err = (err) => ({
    status: err.code || 4, // undefined error
    error: err.message
});
