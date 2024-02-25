# install gensim (4.3.2)
!pip install gensim==4.3.2 --upgrade
!pip install nltk==3.8.1 --upgrade
!pip install spacy==3.6.0 --upgrade
!python -m spacy download en_core_web_sm-3.6.0 --direct

from gensim.models import Word2Vec
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
import spacy
import sys
import json

def dog_or_cat(file_name):
    df = pd.read_csv(file_name)
    df = df.drop(df.tail(1).index)
    return df

def find_closest_word(target, temperament_words):
    nlp = spacy.load('en_core_web_md') 
    
    target = target.lower()
    closest_word = None
    max_similarity = 0
    target_token = nlp(target)
    
    # Find the closest word in the temperament column based on similarity
    if target not in temperament_words:
        for word in temperament_words:
            word = word.lower()
            compare_token = nlp(word)
            similarity = target_token.similarity(compare_token)
            if similarity > max_similarity:
                closest_word = word
                max_similarity = similarity
    else:
        return target
                
    return closest_word

def recommend_breeds(user_input, df):
    # Preprocess user input
    user_input = user_input.lower().replace(',', '').split()
    temperament_descriptions = df["Temperment"].str.lower().str.replace(',', '').str.split()

    ## get unique characters
    characteristic = []
    for element in temperament_descriptions:
        for word in element:
            if word not in characteristic:
                characteristic.append(word)

    # Find closest words in temperment column for each word in user input
    closest_temperament_words = []
    for word in user_input:
        closest_word = find_closest_word(word, characteristic)
        if closest_word:
            closest_temperament_words.append(closest_word)

    # Get word embeddings for closest temperament words
    word2vec_model = Word2Vec(sentences=temperament_descriptions, vector_size=100, window=5, min_count=1, workers=4)
    user_embeddings = []
    for word in closest_temperament_words:
        user_embeddings.append(word2vec_model.wv[word])

    # Average user embeddings
    user_vector = np.mean(user_embeddings, axis=0)

    ## train kmeans model
    document_vectors = []
    for description in temperament_descriptions:
        vectors = [word2vec_model.wv[word] for word in description if word in word2vec_model.wv]
        if vectors:
            document_vectors.append(np.mean(vectors, axis=0))
        else:
            document_vectors.append(np.zeros(word2vec_model.vector_size))

    document_vectors = np.array(document_vectors)
    kmeans_model = KMeans(n_clusters=25, random_state=42)
    kmeans_model.fit(document_vectors)
    df["Cluster_Labels"] = kmeans_model.labels_

    # Calculate similarity to cluster centroids
    cluster_centroids = kmeans_model.cluster_centers_
    similarities = [np.dot(user_vector, centroid) / (np.linalg.norm(user_vector) * np.linalg.norm(centroid)) for centroid in cluster_centroids]

    # Find nearest cluster
    nearest_cluster_idx = np.argmax(similarities)

    # Retrieve breeds within nearest cluster
    cluster_breeds = df[df["Cluster_Labels"] == nearest_cluster_idx]["BreedName"]
    
    rec_breed = {}
    all_breed = [] 

    for val in recommended_breeds:
        all_breed.append(val)
    rec_breed["breed"] = all_breed

    return rec_breed

if __name__ == "__main__":
    user_input = sys.argv[1]  # Get user input from command line
    # Assuming you have a CSV file to read from
    df = dog_or_cat('your_csv_file.csv')  
    result = recommend_breeds(user_input, df)
    print(json.dumps(result))  # Print the result as JSON