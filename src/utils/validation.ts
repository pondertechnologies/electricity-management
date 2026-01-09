import { NewConnectionFormData, NewConnectionFormErrors } from '../types/new-connection-form';

export const validateNewConnectionForm = (values: NewConnectionFormData): NewConnectionFormErrors => {
  const errors: NewConnectionFormErrors = {};

  // Requester Designation validation
  if (!values.requesterDesignation) {
    errors.requesterDesignation = 'Requester Designation is required';
  }

  // Requester Name validation
  if (!values.requesterName.trim()) {
    errors.requesterName = 'Requester Name is required';
  } else if (values.requesterName.trim().length < 2) {
    errors.requesterName = 'Requester Name must be at least 2 characters';
  }

  // Connection Name validation
  if (!values.connectionName.trim()) {
    errors.connectionName = 'Connection Name is required';
  } else if (values.connectionName.trim().length < 3) {
    errors.connectionName = 'Connection Name must be at least 3 characters';
  }

  // Address validation
  if (!values.address.trim()) {
    errors.address = 'Address is required';
  } else if (values.address.trim().length < 10) {
    errors.address = 'Address must be at least 10 characters';
  }

  // Ward validation
  if (!values.ward.trim()) {
    errors.ward = 'Ward is required';
  } else if (!/^\d+$/.test(values.ward.trim())) {
    errors.ward = 'Ward must be a number';
  }

  // Load Demand validation
  if (values.loadDemand === '' || values.loadDemand === null || values.loadDemand === undefined) {
    errors.loadDemand = 'Load Demand is required';
  } else if (Number(values.loadDemand) <= 0) {
    errors.loadDemand = 'Load Demand must be greater than 0';
  } else if (Number(values.loadDemand) > 10000) {
    errors.loadDemand = 'Load Demand cannot exceed 10000 KW';
  }

  // Service Category validation
  if (!values.serviceCategory) {
    errors.serviceCategory = 'Service Category is required';
  }

  // Service Type validation
  if (!values.serviceType) {
    errors.serviceType = 'Service Type is required';
  }

  // Solar Capacity validation (if provided)
  if (values.solarCapacity !== undefined && values.solarCapacity !== null && values.solarCapacity !== '') {
    const solarCapacityNum = Number(values.solarCapacity);
    if (solarCapacityNum < 0) {
      errors.solarCapacity = 'Solar Capacity cannot be negative';
    } else if (solarCapacityNum > 10000) {
      errors.solarCapacity = 'Solar Capacity cannot exceed 10000 KW';
    }
  }

  return errors;
};

// Format form data for API submission
export const formatFormDataForAPI = (values: NewConnectionFormData) => {
  return {
    requesterDesignation: values.requesterDesignation,
    requesterName: values.requesterName.trim(),
    connectionName: values.connectionName.trim(),
    address: values.address.trim(),
    ward: values.ward.trim(),
    loadDemand: Number(values.loadDemand),
    serviceCategory: values.serviceCategory,
    serviceType: values.serviceType,
    otherComments: values.otherComments?.trim() || null,
    tariffCode: values.tariffCode?.trim() || null,
    solarCapacity: values.solarCapacity ? Number(values.solarCapacity) : null,
  };
};