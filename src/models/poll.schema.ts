import { Schema, model, Types } from 'mongoose';

const pollSchema = new Schema(
  {
    name: String,
    description: String,
    totalVotes: { type: Number, default: 0 },
    yesVotes: { type: Number, default: 0 },
    userId: { type: Types.ObjectId, ref: 'User' },
    voters: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default model('Poll', pollSchema);
