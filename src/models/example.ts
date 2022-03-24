import mongoose from 'mongoose';

export interface IExampleModel {
  user_id?: string;
  name: string;
  description?: string;
}

export interface ExampleModelInterface extends mongoose.Model<ExampleDoc> {
  build(attr: IExampleModel): any
}

export interface ExampleDoc extends mongoose.Document {
  user_id?: string;
  name: string;
  description?: string;
}

export const exampleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
})

exampleSchema.statics.build = (attr: IExampleModel) => {
  return new Example(attr);
}

const Example = mongoose.model<any, ExampleModelInterface>('Example', exampleSchema);


export { Example }