import mongoose, { Document, Schema } from "mongoose";

interface ISocialLink {
  platform: string;
  icon?: string;
  url: string;
}

interface IQuickLink {
  title: string;
  url: string;
}

interface IResponsibleGaming {
  title?: string;
  icon?: string;
}

interface IGamingLicense {
  name?: string;
  icon?: string;
}

interface IBrandPartner {
  name?: string;
  logo?: string;
}

interface IDescriptionSection {
  title?: string;
  content?: string;
}

export interface IFooter extends Document {
  socialLinks: ISocialLink[];
  quickLinks: IQuickLink[];
  responsibleGaming: IResponsibleGaming[];
  gamingLicenses: IGamingLicense[];
  brandPartners: IBrandPartner[];
  logo?: string;
  copyrightText?: string;
  descriptionSection: IDescriptionSection;
  createdAt: Date;
  updatedAt: Date;
}

const footerSchema = new Schema<IFooter>(
  {
    socialLinks: [
      {
        platform: { type: String, required: true },
        icon: { type: String },
        url: { type: String, required: true },
      },
    ],
    quickLinks: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    responsibleGaming: [
      {
        title: { type: String },
        icon: { type: String },
      },
    ],
    gamingLicenses: [
      {
        name: { type: String },
        icon: { type: String },
      },
    ],
    brandPartners: [
      {
        name: { type: String },
        logo: { type: String },
      },
    ],
    logo: { type: String },
    copyrightText: { type: String },
    descriptionSection: {
      title: { type: String },
      content: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFooter>("Footer", footerSchema);
