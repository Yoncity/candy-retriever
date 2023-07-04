import axios from "axios";

const fetchMetadata = async (uri: string): Promise<any> => {
  const response = await axios.get(uri);
  return response.data;
};

export default fetchMetadata;
