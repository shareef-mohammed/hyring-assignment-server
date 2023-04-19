const jwt = require('jsonwebtoken');

const validateClientToken = async (req, res, next) => {
  
    if (req.headers.authorization) {
      
      try {
        const clientToken = req.headers.authorization;
        const decode = jwt.verify(clientToken, process.env.JWT_SECRET_KEY);
        
        const type = decode.type;
        if (type === "clientToken") {
          req.clientId = decode.id
          next();
        }
      } catch (err) {
        return res.status(404).send("authentication failed");
      }
    } else {
      return res.status(404).send("authentication failed");
    }
  };
  
  const validateFreelancerToken = async (req, res, next) => {
    
    if (req.headers.authorization) {
      
      try {
        const freelancer = req.headers.authorization;
        const decode = jwt.verify(freelancer ,process.env.JWT_SECRET_KEY);
    
        const type = decode.type;
        if (type === "freelancerToken") {
          req.freelancerId = decode.id;
          next();
        }
      } catch (err) {
        
        return res.status(404).send("authentication failed");
      }
    } else {
      return res.status(404).send("authentication failed");
    }
  };
  
  exports.validateClientToken = validateClientToken;
  
  exports.validateFreelancerToken = validateFreelancerToken;