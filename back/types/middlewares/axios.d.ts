type infoData = {
    data: any;
};
declare function sentenceSimilarity(inputData: object): Promise<any>;
declare function sentenceSimilarityUpdate(inputData: object): Promise<any>;
declare function emotionAnalysis(inputData: object): Promise<string | infoData>;
declare function get(endpoint: string): Promise<string | infoData>;
export { get, emotionAnalysis, sentenceSimilarity, sentenceSimilarityUpdate };
