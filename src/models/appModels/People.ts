import mongoose, { Schema, Document } from 'mongoose';

interface IPeople extends Document {
  removed: boolean;
  enabled: boolean;
  firstname: string;
  lastname: string;
  isClient: boolean;
  company?: mongoose.Types.ObjectId;
  bio?: string;
  idCardNumber?: string;
  idCardType?: string;
  securitySocialNbr?: string;
  taxNumber?: string;
  birthday?: Date;
  birthplace?: string;
  gender?: 'male' | 'female';
  photo?: string;
  bankName?: string;
  bankIban?: string;
  bankSwift?: string;
  bankNumber?: string;
  bankRouting?: string;
  customField?: {
    fieldName: string;
    fieldType: string;
    fieldValue: any;
  }[];
  location?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  city?: string;
  State?: string;
  postalCode?: number;
  country?: string;
  phone?: string;
  otherPhone?: string[];
  email?: string;
  otherEmail?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
    snapchat?: string;
  };
  website?: string;
  images?: {
    id: string;
    name: string;
    path: string;
    description: string;
    isPublic: boolean;
  }[];
  files?: {
    id: string;
    name: string;
    path: string;
    description: string;
    isPublic: boolean;
  }[];
  notes?: string;
  category?: string;
  status?: string;
  approved?: boolean;
  verified?: boolean;
  tags?: string[];
  created: Date;
  updated: Date;
  isPublic: boolean;
}

const peopleSchema: Schema<IPeople> = new Schema<IPeople>({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  firstname: {
    type: String,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  isClient: {
    type: Boolean,
    default: false,
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  bio: String,
  idCardNumber: {
    type: String,
    trim: true,
  },
  idCardType: String,
  securitySocialNbr: String,
  taxNumber: String,
  birthday: Date,
  birthplace: String,
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  photo: String,
  bankName: String,
  bankIban: String,
  bankSwift: String,
  bankNumber: String,
  bankRouting: String,
  customField: [
    {
      fieldName: {
        type: String,
        trim: true,
        lowercase: true,
      },
      fieldType: {
        type: String,
        trim: true,
        lowercase: true,
        default: 'string',
      },
      fieldValue: {},
    },
  ],
  location: {
    latitude: Number,
    longitude: Number,
  },
  address: String,
  city: String,
  State: String,
  postalCode: Number,
  country: {
    type: String,
    trim: true,
  },
  phone: String,
  otherPhone: [String],
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  otherEmail: [String],
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    tiktok: String,
    youtube: String,
    snapchat: String,
  },
  website: {
    type: String,
    trim: true,
    lowercase: true,
  },
  images: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  notes: String,
  category: String,
  status: String,
  approved: Boolean,
  verified: Boolean,
  tags: [{ type: String, trim: true, lowercase: true }],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
});

peopleSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IPeople>('People', peopleSchema);
