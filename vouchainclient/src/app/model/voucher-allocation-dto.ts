import { VoucherDTO } from './voucher-dto';

export class VoucherAllocationDTO {
    fromId: string;
    toId: string;
    iban: string;
    accountHolder: string;
    voucherList: Array<VoucherDTO>;
    profile: string;
}
