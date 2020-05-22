import React, { useContext } from 'react';
import classNames from 'classnames';
import { useApiForm } from '../../../../util/hooks';
import { FormContext } from '../../../../store/FormContext';
import { Spinner } from '../../../../components/Spinner';

export const SettingsSecurity = () => {
  const { form } = useContext(FormContext);

  const { loading, values, setValues, handleChange, handleSubmit } = useApiForm(`/security/${form.id}`, {
    initialValues: {
      recaptchaSecret: '',
      honey: '',
      allowedDomains: '',
      recaptchaEnabled: false,
    },
    ignoredValues: ['formId', 'id'],
  });

  return (
    <div className="mt-4">
      {loading && <Spinner />}

      {!loading && (
        <form>
          <div>
            <div>
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">ReCaptcha</h3>
                <p className="max-w-2xl mt-1 text-sm leading-5 text-gray-500">
                  Help secure your form with AI powered protection. <span className="text-blue-600 cursor-pointer">Read more</span>
                </p>
              </div>
              <div className="mt-6 sm:mt-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="username" className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    Enabled
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <span
                      role="checkbox"
                      tabIndex={0}
                      className={classNames(
                        'relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline',
                        { 'bg-gray-200': !values.recaptchaEnabled, 'bg-blue-600': values.recaptchaEnabled },
                      )}
                      onClick={() => setValues({ ...values, recaptchaEnabled: !values.recaptchaEnabled })}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames('inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200', {
                          'translate-x-0': !values.recaptchaEnabled,
                          'translate-x-5': values.recaptchaEnabled,
                        })}
                      ></span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">Secret</label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg rounded-md shadow-sm">
                      <input
                        className={classNames('form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5', {
                          'bg-gray-100': !values.recaptchaEnabled,
                        })}
                        disabled={!values.recaptchaEnabled}
                        name="recaptchaSecret"
                        value={values.recaptchaSecret}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 mt-8 border-t border-gray-200 sm:mt-5 sm:pt-10">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Honeypot Field</h3>
                <p className="max-w-2xl mt-1 text-sm leading-5 text-gray-500">
                  Lure in bots by having a hidden field on your site. <span className="text-blue-600 cursor-pointer">Read more</span>
                </p>
              </div>
              <div className="mt-6 sm:mt-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">Field name</label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-xs rounded-md shadow-sm">
                      <input
                        className="block w-full transition duration-150 ease-in-out form-input sm:text-sm sm:leading-5"
                        name="honey"
                        value={values.honey}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 mt-8 border-t border-gray-200 sm:mt-5 sm:pt-10">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Allowed Domains</h3>
                <p className="max-w-2xl mt-1 text-sm leading-5 text-gray-500">
                  Restrict submissions to only come from certail domains. <span className="text-blue-600 cursor-pointer">Read more</span>
                </p>
              </div>
              <div className="mt-6 sm:mt-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">Domains</label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg rounded-md shadow-sm">
                      <input
                        className="block w-full transition duration-150 ease-in-out form-input sm:text-sm sm:leading-5"
                        name="allowedDomains"
                        value={values.allowedDomains}
                        onChange={handleChange}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500" id="email-description">
                      Seperated by commas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5 mt-8 border-t border-gray-200">
            <div className="flex justify-end">
              <span className="inline-flex ml-3 rounded-md shadow-sm">
                <button
                  onClick={e => {
                    e.preventDefault();

                    handleSubmit();
                  }}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-blue-600 border border-transparent rounded-md hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700"
                >
                  Save
                </button>
              </span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
