            <button
              className={`flex items-center w-full py-3 px-4 ${
                activeView === 'reports' ? 'bg-indigo-800 text-white' : 'text-gray-300 hover:bg-gray-700'
              } rounded transition-colors`}
              onClick={() => {
                console.log('Reports button clicked in sidebar');
                window.location.hash = 'reports';
              }}
            >
              <i className="fas fa-chart-bar mr-3"></i>
              <span>Reports</span>
            </button> 