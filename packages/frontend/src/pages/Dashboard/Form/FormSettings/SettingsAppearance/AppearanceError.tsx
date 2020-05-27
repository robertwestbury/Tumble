import React, { useContext } from 'react';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';
import { API_URL } from '../../../../../api/api';
import { FormContext } from '../../../../../store/FormContext';

// TODO: Refactor to not use any
interface Props {
  values: { [key: string]: any };
  setValues: (values: any) => any;
  handleChange: (eventOrPath: string | React.ChangeEvent<any>) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
}

export const AppearanceError = ({ values, setValues, handleChange }: Props) => {
  const { form } = useContext(FormContext);

  const SELECTED_STYLE =
    'cursor-pointer px-3 py-2 font-medium text-sm leading-5 rounded-md text-blue-700 bg-blue-100 focus:outline-none focus:text-blue-800 focus:bg-blue-200';
  const UNSELECTED_STYLE =
    'cursor-pointer px-3 py-2 font-medium text-sm leading-5 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-600 focus:bg-blue-50';

  return (
    <div className="w-full mt-4">
      <div className="w-full">
        <div className="flex flex-row">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Error Page</h3>
          <div className="flex flex-col justify-end">
            <span className="ml-2 text-sm text-blue-600 cursor-pointer" onClick={() => window.open(`${API_URL}/appearance/${form.id}/preview/error`)}>
              (Preview)
            </span>
          </div>
        </div>
        <div className="mt-2">
          <nav className="flex">
            <a className={values.errorMode === 'Our' ? SELECTED_STYLE : UNSELECTED_STYLE} onClick={() => setValues({ ...values, errorMode: 'Our' })}>
              Use our page
            </a>
            <a
              className={(values.errorMode === 'Custom' ? SELECTED_STYLE : UNSELECTED_STYLE) + ' ml-2'}
              onClick={() => setValues({ ...values, errorMode: 'Custom' })}
            >
              Use a custom page
            </a>
          </nav>
        </div>

        {values.errorMode === 'Custom' && (
          <div className="max-w-full mt-6 sm:mt-5 sm:border-t sm:border-gray-200 sm:pt-5">
            <div>
              <label className="block text-sm font-medium leading-5 text-gray-700">Custom Page URL</label>
              <div className="max-w-full mt-1 rounded-md shadow-sm">
                <input
                  className="block w-full transition duration-150 ease-in-out form-input sm:text-sm sm:leading-5"
                  value={values.errorCustomRedirect}
                  name="errorCustomRedirect"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        {values.errorMode === 'Our' && (
          <div>
            <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="about" className="block mt-2 mb-1 text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:mb-0 sm:mt-0">
                Show dots
              </label>
              <span
                role="checkbox"
                tabIndex={0}
                className={classNames(
                  'bg-gray-200 relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline mb-2',
                  {
                    'bg-blue-600': values.errorDots,
                    'bg-gray-200': !values.errorDots,
                  },
                )}
                onClick={() => setValues({ ...values, errorDots: !values.errorDots })}
              >
                <span
                  className={classNames('translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200', {
                    'translate-x-5': values.errorDots,
                    'translate-x-0': !values.errorDots,
                  })}
                ></span>
              </span>
            </div>

            <div className="grid grid-cols-1 mx-auto mt-4 lg:grid-cols-3 md:grid-cols-2">
              <div className="mb-6">
                <label className="block text-sm font-medium leading-5 text-gray-700">Icon background color</label>

                <div className="mt-2">
                  <SketchPicker color={values.errorIconBackground} onChange={color => setValues({ ...values, errorIconBackground: color.hex })} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium leading-5 text-gray-700">Icon color</label>

                <div className="mt-2">
                  <SketchPicker color={values.errorIconColor} onChange={color => setValues({ ...values, errorIconColor: color.hex })} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium leading-5 text-gray-700">Background Color</label>

                <div className="mt-2">
                  <SketchPicker color={values.errorBackgroundColor} onChange={color => setValues({ ...values, errorBackgroundColor: color.hex })} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
