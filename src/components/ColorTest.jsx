import React from 'react';

const ColorTest = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">DaisyUI Color Test</h1>
      
      {/* Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary">Primary (#3e503a)</button>
          <button className="btn btn-secondary">Secondary (#dcb207)</button>
          <button className="btn btn-accent">Accent (#1c8f1c)</button>
          <button className="btn btn-neutral">Neutral (#565656)</button>
          <button className="btn btn-info">Info</button>
          <button className="btn btn-success">Success (#1c8f1c)</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-error">Error</button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Card Title</h2>
              <p>This card uses your custom base-100 color (#faf9f6)</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Action</button>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Another Card</h2>
              <p>This card uses base-200 color (#f5f5f5)</p>
              <div className="card-actions justify-end">
                <button className="btn btn-secondary">Secondary</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alerts</h2>
        <div className="space-y-2">
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Success alert with your custom green (#1c8f1c)</span>
          </div>
          
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Info alert</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <div className="badge badge-primary">Primary</div>
          <div className="badge badge-secondary">Secondary</div>
          <div className="badge badge-accent">Accent</div>
          <div className="badge badge-neutral">Neutral</div>
          <div className="badge badge-success">Success</div>
        </div>
      </div>

      {/* Form Elements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Form Elements</h2>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" placeholder="email@example.com" className="input input-bordered" />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input type="password" placeholder="password" className="input input-bordered" />
        </div>
      </div>
    </div>
  );
};

export default ColorTest; 