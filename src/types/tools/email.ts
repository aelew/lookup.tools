export type EmailCardProps = { email: string };

export type GoogleProfileContainerData = {
  PROFILE_CONTAINER: {
    profile: {
      personId: string;
      inAppReachability: {
        PROFILE: {
          apps: string[];
        };
      };
      profileInfos: {
        PROFILE: {
          userTypes: string[];
        };
      };
      coverPhotos: {
        PROFILE: {
          url: string;
          isDefault: boolean;
          flathash: string | null;
        };
      };
      profilePhotos: {
        PROFILE: {
          url: string;
          isDefault: boolean;
          flathash: string;
        };
      };
      names: {
        PROFILE?: {
          fullname: string;
          firstName: string;
          lastName: string | null;
        };
        DOMAIN_PROFILE?: {
          fullname: string;
          firstName: string;
          lastName: string | null;
        };
      };
      emails: {
        PROFILE: {
          value: string;
        };
      };
      extendedData: {
        dynamiteData: {
          entityType: 'PERSON' | 'GOOGLE_GROUP';
          customerId: string;
          dndState: string | null;
          presence: string | null;
        };
        gplusData: {
          contentRestriction: string;
          isEntrepriseUser: boolean;
        };
      };
      sourceIds: {
        PROFILE: {
          lastUpdated: string;
        };
        GOOGLE_GROUP?: {
          lastUpdated: null;
        };
      };
    };
    play_games: null;
    maps: {
      photos: unknown[];
      reviews: unknown[];
      stats: Record<string, unknown>;
    };
    calendar: null;
  };
};

export type GoogleProfileResult = {
  success: true;
  google: GoogleProfileContainerData['PROFILE_CONTAINER'] | null;
};

export type RegisteredAccountsResult = {
  success: true;
  websites: { status: string; domain: string }[];
};
