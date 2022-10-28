/* --- REST ENDPOINTS --- */

/* Company Related URIs */
export const cpyLogin: string = '/api/companies/companyLogin';
export const cpyModProfile: string = '/api/companies/modCompanyProfile';
export const cpyShowProfile: string = '/api/companies/showCompanyProfile';
export const cpySignup: string = '/api/companies/companySignUp';
export const cpyUpContract: string = '/api/companies/checkLoadSign';

/* Employee Related URIs */
export const empCheckInvitationCode: string = '/api/employees/checkInvitationCode';
export const empInvite: string = '/api/employees/employSignUp'; /* Viene richiamato dalla Company per effettuare l'invito dell'Employee */
export const empLogin: string = '/api/employees/employeeLogin'; /* Da verificare */
export const empModProfile: string = '/api/employees/modEmployeeProfile';
export const empShowList: string = '/api/employees/showEmployeesList'; /* Viene richiamato dalla Company per riempire la lista dei propri Employees */
export const empShowProfile: string = '/api/employees/showEmployeeProfile'; /* Da verificare */
export const empSignup: string = '/api/employees/employeeConfirmation';

/* Geo Related URIs */
export const geoAllCities: string = '/api/geographic/getAllCities';
export const geoAllProvinces: string = '/api/geographic/getAllProvinces';
export const geoCitiesByProvinces: string = '/api/geographic/getAllCitiesByProvince';

/* Merchant Related URIs */
export const mrcLogin: string = '/api/merchants/merchantLogin';
export const mrcModProfile: string = '/api/merchants/modMerchantProfile';
export const mrcShowList: string = '/api/merchants/showMerchantsList'; /* TODO: da verificare */
export const mrcShowProfile: string = '/api/merchants/showMerchantProfile';
export const mrcSignup: string = '/api/merchants/merchantSignUp';

/* Session Related URIs */
export const resetSession: string = '/api/session/resetSession';
export const verifySession: string = '/api/session/verifySession';

/* Transactions Related URIs */
export const cpyOrdersList: string = '/api/transactions/getCompanyOrdersList';
export const trcDeleteOrder: string = '/api/transactions/companyOrderDel'; /*/{trcId}*/
export const trcDetail: string = '/api/transactions/transactionDetail'; /* {usrId}/{trcId} @GetMapping public TransactionDTO transactionDetail */
export const trcExport: string = '/api/transactions/exportTransaction'; /* @PostMapping public TransactionDTO exportTransaction(@RequestBody TransactionRequestDTO transactionRequest) */
export const trcList: string = '/api/transactions/transactionsList'; /* @PostMapping public DTOList<TransactionDTO> transactionsList(@RequestBody TransactionRequestDTO transactionRequest) */
export const trcRedeemedList: string = '/api/transactions/getReedemedVoucherOrdersList'; /* @PostMapping public DTOList<TransactionDTO> getReedemedVoucherOrdersList(@RequestBody TransactionRequestDTO transactionRequest)  */
export const trcInvoiceDownload: string = '/api/transactions/getInvoice'; /* {trcId}/{type} @GetMapping */

/* Visa Developer API call as rest api  */

export const trcVisaAPI : String = '/api/transactions/apikey';

/* User Related URIs */
export const usrChangePwd: string = '/api/users/changePassword'; /* La Url si perfeziona con l'indicazione di /{profile} che può assumere valore company, employee, merchant;*/
export const usrModifyPwd: string = '/api/users/modifyPassword'; /* La Url si perfeziona con l'indicazione di /{resetCode} che è il codice della query-string della url della pagina; */
export const usrReplacePwd: string = '/api/users/replacePassword';

/* Vouchers Related URIs */
export const empExpendableVoucher: string = '/api/vouchers/getExpendableVouchersList';
export const vouActiveVouchersList: string = '/api/vouchers/getActiveVoucherList'; /* /{usrId} @GetMapping public DTOList<VoucherDTO> getActiveVouchersList() */
export const vouExpendedVoucher: string = '/api/vouchers/getExpendedVoucherList'; /* Da verificare */
export const vouNewVoucherType: string = '/api/vouchers/newVoucherType'; /* @PostMapping public SimpleResponseDTO newVoucherType(@RequestBody VoucherDTO voucherDTO) */
export const vouPurchasableList: string = '/api/vouchers/getPurchasableVouchersList'; /* @GetMapping public DTOList<VoucherDTO> getPurchasableVouchersList() */
export const vouPurchaseVouchers: string = '/api/vouchers/purchaseVouchers'; /* /{usrId} @PostMapping public DTOList<VoucherDTO> purchaseVouchers(@PathVariable("usrId") String usrId, @RequestBody List<VoucherDTO> voucherList) */
export const vouVouchersAllocation: string = '/api/vouchers/voucherAllocation'; /* @PostMapping @RequestBody List<VoucherAllocationDTO> allocationList */

/* --- HTTP HEADERS --- */

/* Headers parameters */
export const cpyHeader: string = 'company:123456';
export const empHeader: string = 'employee:123456';
export const mrcHeader: string = 'merchant:123456';
export const usrHeader: string = 'user:123456';
export const vchHeader: string = 'voucher:123456';
export const trcHeader: string = 'transaction:123456';
