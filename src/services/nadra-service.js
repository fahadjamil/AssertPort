/**
 * NADRA API Service
 *
 * This service handles all interactions with the NADRA (National Database and Registration Authority) API
 * for identity verification in Pakistan.
 */

// NADRA API Service class
class NadraService {
  constructor() {
    // Get API credentials from environment variables
    this.apiKey = process.env.NADRA_API_KEY || "";
    this.apiSecret = process.env.NADRA_API_SECRET || "";
    this.apiEndpoint = process.env.NADRA_API_ENDPOINT || "https://api.nadra.gov.pk/v1";

    if (!this.apiKey || !this.apiSecret) {
      console.warn("NADRA API credentials not found in environment variables");
    }
  }

  // Verify identity using CNIC and personal details
  async verifyCNIC(data) {
    try {
      if (!this.validateCNIC(data.cnic)) {
        throw {
          code: "INVALID_CNIC",
          message: "Invalid CNIC format. Please use format: 00000-0000000-0",
        };
      }

      console.log(`Verifying CNIC: ${data.cnic} for ${data.fullName}`);
      await this.delay(2000);

      const response = this.generateMockResponse(data);

      await this.logVerification({
        requestId: response.requestId,
        cnic: data.cnic,
        timestamp: new Date().toISOString(),
        verified: response.verified,
        adminId: "admin-123",
        adminName: "Admin User",
        verificationMethod: "cnic",
        matchPercentage: response.matchPercentage,
      });

      return response;
    } catch (error) {
      console.error("NADRA verification error:", error);
      throw error;
    }
  }

  // Verify identity using biometric data
  async verifyBiometric(data) {
    try {
      if (!this.validateCNIC(data.cnic)) {
        throw {
          code: "INVALID_CNIC",
          message: "Invalid CNIC format. Please use format: 00000-0000000-0",
        };
      }

      if (!data.biometricData || data.biometricData.length < 100) {
        throw {
          code: "INVALID_BIOMETRIC",
          message: "Invalid biometric data provided",
        };
      }

      console.log(`Verifying biometric (${data.biometricType}) for CNIC: ${data.cnic}`);
      await this.delay(3000);

      const response = {
        verified: Math.random() > 0.2,
        matchPercentage: Math.floor(Math.random() * 30) + 70,
        details: {
          photo: {
            matched: Math.random() > 0.3,
            confidence: Math.floor(Math.random() * 20) + 80,
          },
        },
        requestId: `BIO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
      };

      await this.logVerification({
        requestId: response.requestId,
        cnic: data.cnic,
        timestamp: new Date().toISOString(),
        verified: response.verified,
        adminId: "admin-123",
        adminName: "Admin User",
        verificationMethod: "biometric",
        matchPercentage: response.matchPercentage,
      });

      return response;
    } catch (error) {
      console.error("NADRA biometric verification error:", error);
      throw error;
    }
  }

  // Get verification history for a CNIC
  async getVerificationHistory(cnic) {
    if (!this.validateCNIC(cnic)) {
      throw {
        code: "INVALID_CNIC",
        message: "Invalid CNIC format. Please use format: 00000-0000000-0",
      };
    }

    await this.delay(1000);

    const history = [];
    const attempts = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < attempts; i++) {
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - i);

      history.push({
        requestId: `REQ-${Date.now() - i * 86400000}-${Math.floor(Math.random() * 1000)}`,
        cnic: cnic,
        timestamp: timestamp.toISOString(),
        verified: Math.random() > 0.3,
        adminId: `admin-${100 + i}`,
        adminName: `Admin User ${i + 1}`,
        verificationMethod: i % 2 === 0 ? "cnic" : "biometric",
        matchPercentage: Math.floor(Math.random() * 30) + 70,
      });
    }

    return history;
  }

  validateCNIC(cnic) {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    return cnicRegex.test(cnic);
  }

  async logVerification(log) {
    console.log("NADRA Verification Log:", log);
  }

  generateMockResponse(data) {
    const isValid = data.cnic.startsWith("3520") || data.cnic.startsWith("4210");
    const matchPercentage = isValid ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 40) + 30;

    return {
      verified: isValid,
      matchPercentage: matchPercentage,
      details: {
        fullName: {
          matched: isValid && Math.random() > 0.1,
          confidence: isValid ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 40) + 30,
        },
        fatherName: data.fatherName
          ? {
              matched: isValid && Math.random() > 0.2,
              confidence: isValid ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 40) + 30,
            }
          : undefined,
        address: {
          matched: isValid && Math.random() > 0.3,
          confidence: isValid ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 30,
        },
        photo: {
          matched: isValid && Math.random() > 0.2,
          confidence: isValid ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 40) + 30,
          imageUrl: isValid ? "/placeholder.svg?height=150&width=150" : undefined,
        },
      },
      requestId: `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export a singleton instance
export const nadraService = new NadraService();