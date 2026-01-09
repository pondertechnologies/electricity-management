export interface Consumer {
  id: number;
  consumerNumber: string;
  consumerName: string;
  distribution: string;
  sanctionedLoad: number;
  circle: string;
  section: string;
  excessDemand: number;
  pfPenalty: number;
  dueAmount: number;
  dueDate: string;
  zeroUnitMonths: number;
  bpscAmount: number;
  bpscSlipDate: string;
  serviceStatus: string;
  serviceType: string;
  billPaidBy: string;
  mobileNumber: string;
  address: string;
  details: string;
  ebExtract: string;
}

export interface ConsumerDetails {
  info: {
    consumerNumber: string;
    consumerName: string;
    address: string;
    region: string;
    circle: string;
    section: string;
    distribution: string;
    serviceStatus: string;
    serviceCategory: string;
    tariffCode: string;
    sanctionedLoad: number;
    temporarilyReducedLoad: number | null;
    meterNumber: string;
    phase: string;
    voltageLevel: string;
    billPaidBy: string;
    mobileNumber: string;
    excessDemand: number | null;
    pfPenalty: number | null;
    totalDueAmount: number | null;
    dueDate: string | null;
    zeroUnitConsumptionInMonths: number | null;
    corporationWard: string;
    corporationZone: string;
    accdAsOnDate: string;
    accdAvailable: string;
    mcdAsOnDate: string;
    mcdAvailable: string;
    gstNumber: string;
    consumerRating: string;
    aadharStatus: string;
    panNumber: string;
    minCharge: number;
    fixedCost: number;
    bpsc: string;
    weldingCharge: string;
    electricityTax: string;
    serviceType: string;
    solarPvInstalledCapacity: number;
    solarGenerationMeterType: string | null;
    solarGenerationMeterMake: string | null;
    solarGenerationMeterSlno: string | null;
    createdAt: string;
    modifiedAt: string;
  };
  due: Array<{
    dueDate?: string;
    dueAmount?: number;
    description?: string;
  }>;
  consumption: Array<{
    assessmentDate: string;
    assessmentEntryDate: string;
    assessmentStatus: string;
    readingKwh: number;
    readingKvah: number;
    readingRecordedDemand: number;
    readingPowerFactor: number;
    consumptionUnits: number;
    chargesCc: number;
    chargesElectricity: number;
    chargesWelding: number;
    chargesExcessDemand: number;
    chargesPfPenalty: number;
    chargesFixed: number;
    chargesTotal: number;
    deductionAdvanceAmountPaid: number;
    deductionAdjustment: number;
    finalbillAmountToBePaid: number;
    finalbillDueDate: string;
    collectionAmountPaid: number;
    collectionReceiptNo: string;
    collectionDate: string;
    createdAt: string;
    modifiedAt: string;
  }>;
  solarConsumption: any;
  meterChange: Array<{
    changeDate?: string;
    oldMeter?: string;
    newMeter?: string;
    reason?: string;
  }>;
  miscCollection: Array<{
    slipDate: string;
    slipReason: string;
    slipPeriod: string;
    totalSlipAmount: number;
    installDetails: string;
    installAmount: number;
    dueDate: string | null;
    receiptNo: string;
    collectionDate: string;
    accountDescription: string;
    accountWiseAmount: number;
    createdAt: string;
    modifiedAt: string;
  }>;
  tariffChange: Array<{
    changeDate?: string;
    oldTariff?: string;
    newTariff?: string;
  }>;
  htBills: Array<any>;
  extractionLogs: Array<{
    parseStatus: string;
    remarks: string | null;
    createdAt: string;
  }>;
}

export interface ConsumerFilters {
  consumerNumber?: string;
  consumerName?: string;
  mobileNumber?: string;
  distribution?: string;
  circle?: string;
  section?: string;
  serviceStatus?: string;
  tariffCode?: string;
  voltageLevel?: string;
  dataFilter?: string;
  fromDueDate?: string;
  toDueDate?: string;
}

export interface FilterOptions {
  distributions?: string[];
  sections?: string[];
  serviceStatus?: string[];
  circles?: string[];
}