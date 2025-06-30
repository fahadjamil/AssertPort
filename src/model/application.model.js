/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} loginId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string|null} cnic_number
 * @property {string} media
 * @property {string} device_token
 * @property {string} country_name
 * @property {string} country_code
 * @property {string} phone
 * @property {boolean} isPhoneVerfied
 */

/**
 * @typedef {Object} Vehicle
 * @property {string} [id]
 * @property {string} [make]
 * @property {string} [model]
 * @property {string} [year]
 * @property {string} [registrationNumber]
 * @property {string|null} [engineNumber]
 * @property {string} [chassisNumber]
 * @property {string} [mileage]
 * @property {string} [condition]
 * @property {string} [marketValue]
 * @property {File|null} uploadedImage
 */

/**
 * @typedef {Object} currentStatus
 * @property {string} id
 * @property {string} key
 * @property {string} label
 * @property {string} stepOrder
 * @property {boolean} isFinal
 */

/**
 * @typedef {Object} applicationLog
 * @property {string} id
 * @property {string} applicationId
 * @property {string} applicationType
 * @property {string} statusId
 * @property {string} notes
 * @property {string} createdAt
 * @property {currentStatus} application_status
 */

/**
 * @typedef {Object} phoneData
 * @property {string} countryCode
 * @property {string} countryName
 * @property {string} phone
 */

/**
 * @typedef {Object} userMedia
 * @property {string} url
 * @property {string} path
 */

/**
 * @typedef {Object} financeContract
 * @property {string} id
 * @property {string} financeAmount
 * @property {string} tenureMonth
 * @property {string} monthlyInstallment
 * @property {string} totalPayment
 * @property {string} contractDate
 * @property {string} contractNumber
 */

/**
 * @typedef {Object} Agent
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {string} [email]
 * @property {string} [assignedArea]
 */

/**
 * @typedef {Object} Application
 * @property {string} id
 * @property {string} inspectionId
 * @property {string} formNumber
 * @property {string} name
 * @property {string} cnic
 * @property {string} vehicleRegNo
 * @property {string} submittedDate
 * @property {string} currentStage
 * @property {string} formType
 * @property {string} currentAddress
 * @property {string} ntn
 * @property {string} maritalStatus
 * @property {string} purposeOfLoan
 * @property {string} ownership
 * @property {phoneData} phone
 * @property {string} designation
 * @property {string} companyName
 * @property {string} companyAddress
 * @property {string} employedSince
 * @property {string} employmentStatus
 * @property {string} businessSince
 * @property {string} businessPremise
 * @property {string} natureOfBusiness
 * @property {string} netTakeHomeIncome
 * @property {string} otherIncome
 * @property {string} sourceOfOtherIncome
 * @property {string} legalEntity
 * @property {string} numberOfPartners
 * @property {string} partnerName
 * @property {string} partnerCnic
 * @property {string} grossSalary
 * @property {string} netHouseholdIncome
 * @property {string} residentialStatus
 * @property {string} rentAmount
 * @property {string} propertySize
 * @property {string} propertySizeInNumber
 * @property {string} referenceName
 * @property {string} referenceGuardianName
 * @property {string} referenceCnic
 * @property {string} referenceRelationshipWithApplicant
 * @property {string} referenceAddress
 * @property {phoneData} referencePhoneNumber
 * @property {string} hasCreditCard
 * @property {string} creditLimit
 * @property {userMedia[]} cnic_front
 * @property {userMedia[]} cnic_back
 * @property {userMedia[]} photo
 * @property {userMedia[]} carRegistrationBook
 * @property {userMedia[]} bankStatement
 * @property {userMedia[]} salarySlipOrIncomeProof
 * @property {userMedia[]} utilityBill
 * @property {userMedia[]} carVerificationPhoto
 * @property {string} nadraVerificationStatus
 * @property {string} carVerificationStatus
 * @property {"verified"|"pending"|"failed"} creditScoreStatus
 * @property {string} inspectionStatus
 * @property {"verified"|"pending"|"failed"} evaluationStatus
 * @property {string} contractStatus
 * @property {string} filePickupStatus
 * @property {"verified"|"pending"|"failed"} lienMarkingStatus
 * @property {"verified"|"pending"|"failed"} reviewStatus
 * @property {User} user
 * @property {Vehicle} [Car]
 * @property {currentStatus} currentStatus
 * @property {applicationLog[]} application_status_logs
 * @property {financeContract} FinanceContract
 * @property {Agent} agent
 */
