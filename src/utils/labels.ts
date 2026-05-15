export function getProfessionLabel(t: (k: string) => string, raw: string): string {
  if (!raw) return raw;
  const k = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    psychologist: "professionTypes.psychologist",
    psychiatrist: "professionTypes.psychiatrist",
    "art therapist": "professionTypes.artTherapist",
    "music therapist": "professionTypes.musicTherapist",
    counselor: "professionTypes.counselor",
    "social worker": "professionTypes.socialWorker",
  };
  return map[k] ? t(map[k]) : raw;
}

export function getInstitutionTypeLabel(t: (k: string) => string, type: string): string {
  switch (type) {
    case "independent":
      return t("institutionTypes.privatePractice");
    case "clinic":
      return t("institutionTypes.clinic");
    case "faskes1":
      return t("institutionTypes.faskes1");
    case "faskes2":
      return t("institutionTypes.faskes2");
    case "faskes3":
      return t("institutionTypes.faskes3");
    case "Private Practice":
      return t("institutionTypes.privatePractice");
    case "Clinic":
      return t("institutionTypes.clinic");
    case "Hospital":
    case "Private Hospital":
      return t("institutionTypes.privateHospital");
    default:
      return type;
  }
}

export function getModeLabel(t: (k: string) => string, mode: string): string {
  switch (mode) {
    case "text":
      return t("sessionModes.textChat");
    case "voice":
      return t("sessionModes.voiceCall");
    case "video":
      return t("sessionModes.videoCall");
    case "offline":
      return t("sessionModes.inPerson");
    default:
      return mode;
  }
}