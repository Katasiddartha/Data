#!/usr/bin/env python3
"""
Backend API Testing for Test Dashboard Application
Tests all FastAPI endpoints for the Test Dashboard backend
"""

import requests
import json
import sys
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://build-tracker-mobile.preview.emergentagent.com"
BASE_URL = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0

    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        self.total_tests += 1
        if success:
            self.passed_tests += 1
            status = "✅ PASS"
        else:
            self.failed_tests += 1
            status = "❌ FAIL"
        
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "details": details
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"    Details: {details}")

    def test_connection(self):
        """Test basic connection to backend"""
        try:
            response = requests.get(f"{BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Hello World":
                    self.log_test("Backend Connection", True, "Successfully connected to FastAPI backend")
                else:
                    self.log_test("Backend Connection", False, f"Unexpected response: {data}")
            else:
                self.log_test("Backend Connection", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            self.log_test("Backend Connection", False, f"Connection error: {str(e)}")

    def test_get_test_data_no_filters(self):
        """Test GET /api/test-data without any filters"""
        try:
            response = requests.get(f"{BASE_URL}/test-data", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Validate structure of first item
                        first_item = data[0]
                        required_fields = ['date', 'tester', 'module', 'test_cases', 'passed', 'failed', 'build']
                        missing_fields = [field for field in required_fields if field not in first_item]
                        
                        if not missing_fields:
                            self.log_test("GET /api/test-data (no filters)", True, f"Retrieved {len(data)} test records with correct structure")
                        else:
                            self.log_test("GET /api/test-data (no filters)", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("GET /api/test-data (no filters)", True, "Retrieved empty data array (no data in sheets)")
                else:
                    self.log_test("GET /api/test-data (no filters)", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("GET /api/test-data (no filters)", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            self.log_test("GET /api/test-data (no filters)", False, f"Request error: {str(e)}")

    def test_get_test_data_with_tester_filter(self):
        """Test GET /api/test-data with tester filter"""
        try:
            # First get all data to find a valid tester
            all_data_response = requests.get(f"{BASE_URL}/test-data", timeout=10)
            if all_data_response.status_code == 200:
                all_data = all_data_response.json()
                if len(all_data) > 0:
                    # Use the first tester from the data
                    test_tester = all_data[0]['tester']
                    
                    # Now test with filter
                    response = requests.get(f"{BASE_URL}/test-data?tester={test_tester}", timeout=10)
                    if response.status_code == 200:
                        filtered_data = response.json()
                        
                        # Verify all returned records have the correct tester
                        if all(record['tester'].lower() == test_tester.lower() for record in filtered_data):
                            self.log_test("GET /api/test-data (tester filter)", True, 
                                        f"Filter by tester '{test_tester}' returned {len(filtered_data)} matching records")
                        else:
                            self.log_test("GET /api/test-data (tester filter)", False, "Filter didn't work correctly")
                    else:
                        self.log_test("GET /api/test-data (tester filter)", False, f"HTTP {response.status_code}: {response.text}")
                else:
                    self.log_test("GET /api/test-data (tester filter)", True, "No data available to test tester filter")
            else:
                self.log_test("GET /api/test-data (tester filter)", False, "Could not get initial data for testing")
        except requests.exceptions.RequestException as e:
            self.log_test("GET /api/test-data (tester filter)", False, f"Request error: {str(e)}")

    def test_get_test_data_with_module_filter(self):
        """Test GET /api/test-data with module filter"""
        try:
            # First get all data to find a valid module
            all_data_response = requests.get(f"{BASE_URL}/test-data", timeout=10)
            if all_data_response.status_code == 200:
                all_data = all_data_response.json()
                if len(all_data) > 0:
                    # Use the first module from the data
                    test_module = all_data[0]['module']
                    
                    # Now test with filter
                    response = requests.get(f"{BASE_URL}/test-data?module={test_module}", timeout=10)
                    if response.status_code == 200:
                        filtered_data = response.json()
                        
                        # Verify all returned records have the correct module
                        if all(record['module'].lower() == test_module.lower() for record in filtered_data):
                            self.log_test("GET /api/test-data (module filter)", True, 
                                        f"Filter by module '{test_module}' returned {len(filtered_data)} matching records")
                        else:
                            self.log_test("GET /api/test-data (module filter)", False, "Module filter didn't work correctly")
                    else:
                        self.log_test("GET /api/test-data (module filter)", False, f"HTTP {response.status_code}: {response.text}")
                else:
                    self.log_test("GET /api/test-data (module filter)", True, "No data available to test module filter")
            else:
                self.log_test("GET /api/test-data (module filter)", False, "Could not get initial data for testing")
        except requests.exceptions.RequestException as e:
            self.log_test("GET /api/test-data (module filter)", False, f"Request error: {str(e)}")

    def test_get_test_data_summary(self):
        """Test GET /api/test-data/summary"""
        try:
            response = requests.get(f"{BASE_URL}/test-data/summary", timeout=10)
            if response.status_code == 200:
                data = response.json()
                required_fields = ['total_tests', 'total_passed', 'total_failed', 'pass_rate', 'total_testers', 'total_modules', 'total_builds']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Validate data types
                    int_fields = ['total_tests', 'total_passed', 'total_failed', 'total_testers', 'total_modules', 'total_builds']
                    float_fields = ['pass_rate']
                    
                    type_errors = []
                    for field in int_fields:
                        if not isinstance(data[field], int):
                            type_errors.append(f"{field} should be int, got {type(data[field])}")
                    
                    for field in float_fields:
                        if not isinstance(data[field], (int, float)):
                            type_errors.append(f"{field} should be float, got {type(data[field])}")
                    
                    if not type_errors:
                        self.log_test("GET /api/test-data/summary", True, f"Summary data: {json.dumps(data)}")
                    else:
                        self.log_test("GET /api/test-data/summary", False, f"Type validation errors: {type_errors}")
                else:
                    self.log_test("GET /api/test-data/summary", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("GET /api/test-data/summary", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            self.log_test("GET /api/test-data/summary", False, f"Request error: {str(e)}")

    def test_get_filter_options(self):
        """Test GET /api/test-data/filters"""
        try:
            response = requests.get(f"{BASE_URL}/test-data/filters", timeout=10)
            if response.status_code == 200:
                data = response.json()
                required_fields = ['testers', 'modules', 'builds']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Validate that all fields are arrays
                    type_errors = []
                    for field in required_fields:
                        if not isinstance(data[field], list):
                            type_errors.append(f"{field} should be array, got {type(data[field])}")
                    
                    if not type_errors:
                        self.log_test("GET /api/test-data/filters", True, 
                                    f"Filters: {len(data['testers'])} testers, {len(data['modules'])} modules, {len(data['builds'])} builds")
                    else:
                        self.log_test("GET /api/test-data/filters", False, f"Type validation errors: {type_errors}")
                else:
                    self.log_test("GET /api/test-data/filters", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("GET /api/test-data/filters", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            self.log_test("GET /api/test-data/filters", False, f"Request error: {str(e)}")

    def test_invalid_endpoints(self):
        """Test invalid endpoints return 404"""
        invalid_endpoints = [
            "/api/invalid-endpoint",
            "/api/test-data/invalid",
            "/api/nonexistent"
        ]
        
        for endpoint in invalid_endpoints:
            try:
                response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=10)
                if response.status_code == 404:
                    self.log_test(f"Invalid endpoint {endpoint}", True, "Correctly returns 404")
                else:
                    self.log_test(f"Invalid endpoint {endpoint}", False, f"Expected 404, got {response.status_code}")
            except requests.exceptions.RequestException as e:
                self.log_test(f"Invalid endpoint {endpoint}", False, f"Request error: {str(e)}")

    def test_google_sheets_integration(self):
        """Test that Google Sheets integration is working"""
        try:
            response = requests.get(f"{BASE_URL}/test-data", timeout=15)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Google Sheets Integration", True, 
                                f"Successfully fetched {len(data)} records from Google Sheets")
                else:
                    self.log_test("Google Sheets Integration", False, "Invalid response format")
            else:
                self.log_test("Google Sheets Integration", False, f"HTTP {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            self.log_test("Google Sheets Integration", False, f"Request error: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 80)
        print("BACKEND API TESTING - TEST DASHBOARD APPLICATION")
        print("=" * 80)
        print(f"Testing backend at: {BACKEND_URL}")
        print()

        # Run all test methods
        test_methods = [
            self.test_connection,
            self.test_get_test_data_no_filters,
            self.test_get_test_data_with_tester_filter,
            self.test_get_test_data_with_module_filter,
            self.test_get_test_data_summary,
            self.test_get_filter_options,
            self.test_invalid_endpoints,
            self.test_google_sheets_integration
        ]

        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                self.log_test(test_method.__name__, False, f"Test execution error: {str(e)}")
            print()

        # Summary
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests)*100:.1f}%" if self.total_tests > 0 else "No tests run")
        
        if self.failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"- {result['test']}: {result['details']}")
        
        print("=" * 80)
        return self.failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)