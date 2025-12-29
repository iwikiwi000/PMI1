// middleware/ipWhitelist.js

// ⭐ Zoznam povolených IP adries
const allowedIPs = [
  '::1',            // localhost IPv6 - TY
  '127.0.0.1',      // localhost IPv4 - TY
  '192.168.1.50',   // Kamarát v tvojej sieti
];

// ⭐ Middleware funkcia
const ipWhitelist = (req, res, next) => {
  // Získaj IP adresu klienta
  const clientIP = req.ip || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   (req.connection.socket ? req.connection.socket.remoteAddress : null);

  console.log(`🔍 Požiadavka z IP: ${clientIP}`);

  // Skontroluj či je IP povolená
  if (allowedIPs.includes(clientIP)) {
    console.log(`✅ IP ${clientIP} je povolená`);
    return next(); // Povoľ prístup
  }

  // IP nie je povolená
  console.log(`❌ IP ${clientIP} je blokovaná`);
  return res.status(403).json({ 
    error: 'Prístup zakázaný',
    message: 'Vaša IP adresa nemá povolený prístup k tejto aplikácii'
  });
};

// Export
module.exports = ipWhitelist;