from unittest.mock import MagicMock
import pandas as pd
import pytest

def test_ml_data_structure():
    data = {
        'rating': [4.5],
        'age': [30],
        'size': ['Large'],
        'type_of_ownership': ['Public'],
        'industry': ['IT'],
        'sector': ['Information Technology']
    }
    df = pd.DataFrame(data)
    assert not df.empty
    assert list(df.columns) == ['rating', 'age', 'size', 'type_of_ownership', 'industry', 'sector']

def test_mock_prediction():
    mock_model = MagicMock()
    mock_model.predict.return_value = [100000.0]

    test_data = pd.DataFrame({
        'rating': [4.0],
        'age': [25],
        'size': ['Small'],
        'type_of_ownership': ['Private'],
        'industry': ['Finance'],
        'sector': ['Finance']
    })
    
    result = mock_model.predict(test_data)
    assert result[0] == 100000.0
    mock_model.predict.assert_called_once()
