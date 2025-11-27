# import os
# import time
# import pandas as pd
# import numpy as np
# import joblib
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler
# from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
# from sklearn.ensemble import RandomForestClassifier, StackingClassifier, ExtraTreesClassifier
# from sklearn.linear_model import LogisticRegression
# from xgboost import XGBClassifier
# from lightgbm import LGBMClassifier
# from catboost import CatBoostClassifier
# from imblearn.over_sampling import SMOTE
# import warnings

# # Configuration
# warnings.filterwarnings("ignore")
# os.environ["JOBLIB_MULTIPROCESSING"] = "0"

# def train():
#     start_time = time.time()
#     print("Loading data...")
    
#     # UPDATE THIS PATH TO YOUR ACTUAL CSV LOCATION
#     file_path = "HR_Analytics.csv" 
    
#     if not os.path.exists(file_path):
#         print(f"Error: File {file_path} not found. Please check the path.")
#         return

#     df = pd.read_csv(file_path)

#     # Preprocessing
#     df['Attrition'] = df['Attrition'].map({'Yes':1, 'No':0})
    
#     drop_cols = ['EmpID', 'EmployeeNumber', 'EmployeeCount', 'Over18', 'StandardHours', 'SalarySlab', 'AgeGroup']
#     drop_cols = [c for c in drop_cols if c in df.columns]
#     df = df.drop(columns=drop_cols)

#     y = df['Attrition']
#     X = df.drop(columns=['Attrition'])

#     # Encoding
#     print("Encoding features...")
#     cat_cols = X.select_dtypes(include=['object']).columns.tolist()
#     X_encoded = pd.get_dummies(X, columns=cat_cols, drop_first=True)
#     X_encoded = X_encoded.fillna(X_encoded.median())

#     # SMOTE
#     print("Applying SMOTE...")
#     smote = SMOTE(random_state=42)
#     X_res, y_res = smote.fit_resample(X_encoded, y)

#     # Initial Scaling for Feature Selection
#     scaler_temp = StandardScaler()
#     X_scaled_temp = scaler_temp.fit_transform(X_res)

#     # Feature Selection using LightGBM
#     print("Selecting top features...")
#     lgbm_temp = LGBMClassifier(n_estimators=50, learning_rate=0.05, random_state=42, verbose=-1)
#     lgbm_temp.fit(X_scaled_temp, y_res)

#     importances = lgbm_temp.feature_importances_
#     feature_names = X_encoded.columns
#     top_features_idx = np.argsort(importances)[-50:][::-1]
#     top_features = feature_names[top_features_idx]
    
#     print(f"Top 50 features selected.")

#     # Prepare Final Data with only Top Features
#     X_top = X_encoded[top_features]
    
#     # Resample and Scale based on Top Features
#     X_res_top, y_res_top = SMOTE(random_state=42).fit_resample(X_top, y)
    
#     scaler = StandardScaler()
#     X_scaled_top = scaler.fit_transform(X_res_top)

#     X_train, X_test, y_train, y_test = train_test_split(
#         X_scaled_top, y_res_top, test_size=0.2, stratify=y_res_top, random_state=42
#     )

#     # Define Models
#     print("Building Stacked Model...")
#     base_models = [
#         ('rf', RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42, n_jobs=1)),
#         ('xgb', XGBClassifier(n_estimators=50, max_depth=6, learning_rate=0.03, colsample_bytree=0.8,
#                             use_label_encoder=False, eval_metric='logloss', random_state=42, verbosity=0)),
#         ('lgbm', LGBMClassifier(n_estimators=100, learning_rate=0.03, max_depth=5, random_state=42, verbose=-1)),
#         ('cat', CatBoostClassifier(iterations=100, depth=8, learning_rate=0.03, verbose=0,
#                                 random_state=42, train_dir=None, thread_count=1)),
#         ('et', ExtraTreesClassifier(n_estimators=50, max_depth=5, random_state=42, n_jobs=1))
#     ]

#     stack1 = StackingClassifier(
#         estimators=base_models,
#         final_estimator=LogisticRegression(max_iter=100, C=50, class_weight='balanced'),
#         cv=3, n_jobs=1
#     )

#     stack2 = StackingClassifier(
#         estimators=base_models,
#         final_estimator=RandomForestClassifier(n_estimators=50, max_depth=12, random_state=42, n_jobs=1),
#         cv=3, n_jobs=1
#     )

#     # Final stack must also run single-thread
#     final_stack = StackingClassifier(
#         estimators=[('stack1', stack1), ('stack2', stack2)],
#         final_estimator=XGBClassifier(n_estimators=50, max_depth=6, learning_rate=0.03,
#                                     colsample_bytree=0.8, use_label_encoder=False, eval_metric='logloss',
#                                     random_state=42, verbosity=0),
#         cv=3, n_jobs=1
#     )


#     # Train
#     final_stack.fit(X_train, y_train)

#     # Evaluate
#     y_pred = final_stack.predict(X_test)
#     acc = accuracy_score(y_test, y_pred)
#     print(f"\nModel Trained. Accuracy: {acc:.4f}")

#     # --- SAVING ARTIFACTS ---
#     print("Saving artifacts...")
    
#     # 1. The Model
#     joblib.dump(final_stack, 'attrition_model.pkl')
    
#     # 2. The Scaler
#     joblib.dump(scaler, 'scaler.pkl')
    
#     # 3. The list of column names the model expects (Top 50)
#     joblib.dump(top_features, 'top_features.pkl')
    
#     # 4. The average values of features (to fill missing form inputs)
#     # We take the mean of the original encoded data (before SMOTE/Scaling)
#     feature_means = X_encoded[top_features].mean()
#     joblib.dump(feature_means, "feature_means.pkl")

#     print(f"Done in {time.time() - start_time:.1f} seconds.")

# if __name__ == "__main__":
#     train()

import os
import time
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.ensemble import RandomForestClassifier, StackingClassifier, ExtraTreesClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier
from imblearn.over_sampling import SMOTE
import warnings

warnings.filterwarnings("ignore")
os.environ["JOBLIB_MULTIPROCESSING"] = "0"

def train():
    start_time = time.time()
    print("Loading data...")

    file_path = "HR_Analytics.csv"
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found. Please check the path.")
        return

    df = pd.read_csv(file_path)

    # Preprocessing
    df['Attrition'] = df['Attrition'].map({'Yes':1, 'No':0})
    drop_cols = ['EmpID', 'EmployeeNumber', 'EmployeeCount', 'Over18', 'StandardHours', 'SalarySlab', 'AgeGroup']
    drop_cols = [c for c in drop_cols if c in df.columns]
    df = df.drop(columns=drop_cols)

    y = df['Attrition']
    X = df.drop(columns=['Attrition'])

    print("Encoding features...")
    cat_cols = X.select_dtypes(include=['object']).columns.tolist()
    X_encoded = pd.get_dummies(X, columns=cat_cols, drop_first=True)
    X_encoded = X_encoded.fillna(X_encoded.median())

    # SMOTE to handle imbalance
    print("Applying SMOTE...")
    X_res, y_res = SMOTE(random_state=42).fit_resample(X_encoded, y)

    print("Selecting top features...")
    scaler_temp = StandardScaler()
    X_scaled_temp = scaler_temp.fit_transform(X_res)

    lgbm_temp = LGBMClassifier(n_estimators=50, learning_rate=0.05, random_state=42, verbose=-1)
    lgbm_temp.fit(X_scaled_temp, y_res)

    importances = lgbm_temp.feature_importances_
    feature_names = X_encoded.columns
    top_features_idx = np.argsort(importances)[-50:][::-1]
    top_features = feature_names[top_features_idx]

    X_top = X_encoded[top_features]
    X_res_top, y_res_top = SMOTE(random_state=42).fit_resample(X_top, y)
    scaler = StandardScaler()
    X_scaled_top = scaler.fit_transform(X_res_top)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled_top, y_res_top, test_size=0.2, stratify=y_res_top, random_state=42
    )

    print("Building Stacked Model...")
    base_models = [
        ('rf', RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42, n_jobs=1)),
        ('xgb', XGBClassifier(n_estimators=50, max_depth=6, learning_rate=0.03,
                              colsample_bytree=0.8, eval_metric='logloss',
                              random_state=42, verbosity=0)),
        ('lgbm', LGBMClassifier(n_estimators=100, learning_rate=0.03,
                               max_depth=5, random_state=42, verbose=-1)),
        ('cat', CatBoostClassifier(iterations=100, depth=8, learning_rate=0.03,
                                   verbose=0, random_state=42,
                                   train_dir=None, thread_count=1)),
        ('et', ExtraTreesClassifier(n_estimators=50, max_depth=5,
                                   random_state=42, n_jobs=1))
    ]

    stack1 = StackingClassifier(
        estimators=base_models,
        final_estimator=LogisticRegression(max_iter=100, C=50, class_weight='balanced'),
        cv=3, n_jobs=1
    )

    stack2 = StackingClassifier(
        estimators=base_models,
        final_estimator=RandomForestClassifier(n_estimators=50, max_depth=12,
                                              random_state=42, n_jobs=1),
        cv=3, n_jobs=1
    )

    final_stack = StackingClassifier(
        estimators=[('stack1', stack1), ('stack2', stack2)],
        final_estimator=XGBClassifier(n_estimators=50, max_depth=6,
                                     learning_rate=0.03, colsample_bytree=0.8,
                                     eval_metric='logloss',
                                     random_state=42, verbosity=0),
        cv=3, n_jobs=1
    )

    final_stack.fit(X_train, y_train)

    print("\nEvaluating model...")
    y_pred = final_stack.predict(X_test)
    y_prob = final_stack.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)

    print(f"Accuracy: {acc:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print(f"ROC-AUC Score: {roc:.4f}")
    print("\nConfusion Matrix:")
    print(cm)

    print("\nSaving feature importance...")
    importance_model = LGBMClassifier()
    importance_model.fit(X_train, y_train)

    importances = pd.DataFrame({
        "Feature": top_features,
        "Importance": importance_model.feature_importances_
    }).sort_values(by="Importance", ascending=False)

    importances.to_csv("feature_importance.csv", index=False)
    print("Feature importance saved: feature_importance.csv")

    print("\nSaving model artifacts...")
    joblib.dump(final_stack, 'attrition_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(top_features, 'top_features.pkl')
    joblib.dump(X_encoded[top_features].mean(), "feature_means.pkl")

    print(f"Done in {time.time() - start_time:.1f} seconds.")

if __name__ == "__main__":
    train()
