const allowedIPs = [
  '::1',            // localhost IPv6 - to sme my
  '127.0.0.1',      // localhost IPv4 - to sme my
  '192.168.1.50',
];

const ipWhitelist = (req, res, next) => {
  const clientIP = req.ip || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   (req.connection.socket ? req.connection.socket.remoteAddress : null);

  if (allowedIPs.includes(clientIP)) {
    console.log(`IP ${clientIP} is allowed`);
    return next();
  }

  console.log(`IP ${clientIP} is not allowed`);
  return res.status(403).json({ 
    error: 'Prístup zakázaný',
    message: 'Vaša IP adresa nemá povolený prístup k tejto aplikácii'
  });
};

module.exports = ipWhitelist;