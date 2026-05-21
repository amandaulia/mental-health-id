
import { useQuery } from "@tanstack/react-query";
import { databaseService } from "@/services/database";

type QueryOptions = {
  enabled?: boolean;
};

// OPTIMIZED: Fetch practitioners with all relations in one query
export const usePractitionersWithRelations = (options: QueryOptions = {}) => {
  return useQuery({
    queryKey: ['practitioners-with-relations'],
    queryFn: databaseService.getAllPractitionersWithRelations,
    enabled: options.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// OPTIMIZED: Fetch institutions with all relations in one query
export const useInstitutionsWithRelations = (options: QueryOptions = {}) => {
  return useQuery({
    queryKey: ['institutions-with-relations'],
    queryFn: databaseService.getAllInstitutionsWithRelations,
    enabled: options.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePractitioners = () => {
  return useQuery({
    queryKey: ['practitioners'],
    queryFn: databaseService.getPractitioners,
  });
};

export const usePractitioner = (id: number) => {
  return useQuery({
    queryKey: ['practitioner', id],
    queryFn: () => databaseService.getPractitioner(id),
    enabled: !!id,
  });
};

export const useInstitutions = () => {
  return useQuery({
    queryKey: ['institutions'],
    queryFn: databaseService.getInstitutions,
  });
};

export const useInstitution = (id: number) => {
  return useQuery({
    queryKey: ['institution', id],
    queryFn: () => databaseService.getInstitution(id),
    enabled: !!id,
  });
};

export const useServicesByPractitioner = (practitionerId: number) => {
  return useQuery({
    queryKey: ['services', 'practitioner', practitionerId],
    queryFn: () => databaseService.getServicesByPractitioner(practitionerId),
    enabled: !!practitionerId,
  });
};

export const useServicesByInstitution = (institutionId: number) => {
  return useQuery({
    queryKey: ['services', 'institution', institutionId],
    queryFn: () => databaseService.getServicesByInstitution(institutionId),
    enabled: !!institutionId,
  });
};

export const useContactDetails = () => {
  return useQuery({
    queryKey: ['contact-details'],
    queryFn: databaseService.getContactDetails,
  });
};

export const useContactDetailsByPractitioner = (practitionerId: number) => {
  return useQuery({
    queryKey: ['contact-details', 'practitioner', practitionerId],
    queryFn: () => databaseService.getContactDetailsByPractitioner(practitionerId),
    enabled: !!practitionerId,
  });
};

export const usePractitionersByInstitution = (institutionId: number) => {
  return useQuery({
    queryKey: ['practitioners', 'institution', institutionId],
    queryFn: () => databaseService.getPractitionersByInstitution(institutionId),
    enabled: !!institutionId,
  });
};

export const useContactDetailsByInstitution = (institutionId: number) => {
  return useQuery({
    queryKey: ['contact-details', 'institution', institutionId],
    queryFn: () => databaseService.getContactDetailsByInstitution(institutionId),
    enabled: !!institutionId,
  });
};

export const useLocationsByPractitioner = (practitionerId: number) => {
  return useQuery({
    queryKey: ['locations', 'practitioner', practitionerId],
    queryFn: () => databaseService.getLocationsByPractitioner(practitionerId),
    enabled: !!practitionerId,
  });
};

export const useLocationsByInstitution = (institutionId: number) => {
  return useQuery({
    queryKey: ['locations', 'institution', institutionId],
    queryFn: () => databaseService.getLocationsByInstitution(institutionId),
    enabled: !!institutionId,
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: databaseService.getLocations,
  });
};

export const usePeerCounseling = (options: QueryOptions = {}) => {
  return useQuery({
    queryKey: ['peer-counseling'],
    queryFn: databaseService.getPeerCounseling,
    enabled: options.enabled ?? true,
  });
};

export const useOrganizations = (options: QueryOptions = {}) => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: databaseService.getOrganizations,
    enabled: options.enabled ?? true,
  });
};

export const useActivities = (options: QueryOptions = {}) => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: databaseService.getActivities,
    enabled: options.enabled ?? true,
  });
};
