export interface City {
  '@type': 'City';
  address: string;
  name: string;
}

export interface MarryAction {
  '@type': 'MarryAction';
  agent: Person;
  endTime: string;
  location: City;
  object: Person;
  participants: Person[];
}

export interface Person {
  '@type': 'Person';
  additionalName?: string;
  birthDate?: string;
  birthPlace?: City;
  familyName: string;
  givenName: string;
  description?: string | undefined;
  knows?: Person[];
  parent?: Person[];
  spouse?: Person;
}
