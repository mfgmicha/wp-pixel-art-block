import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { columns, rows } = attributes;
	const blockProps = useBlockProps();

	const previewCells = [];
	const totalCells = Math.min( columns, 12 ) * Math.min( rows, 12 );
	for ( let i = 0; i < totalCells; i++ ) {
		previewCells.push( i );
	}

	const previewCols = Math.min( columns, 12 );
	const previewRows = Math.min( rows, 12 );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Grid Settings', 'pixel-art-creator' ) }>
					<RangeControl
						label={ __( 'Columns', 'pixel-art-creator' ) }
						value={ columns }
						onChange={ ( value ) =>
							setAttributes( { columns: value } )
						}
						min={ 4 }
						max={ 32 }
					/>
					<RangeControl
						label={ __( 'Rows', 'pixel-art-creator' ) }
						value={ rows }
						onChange={ ( value ) =>
							setAttributes( { rows: value } )
						}
						min={ 4 }
						max={ 32 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="telex-pixel-art-editor">
					<div className="telex-pixel-art-editor__info">
						<svg
							className="telex-pixel-art-editor__icon"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="2"
								y="2"
								width="5"
								height="5"
								rx="0.5"
								fill="#cf2e2e"
							/>
							<rect
								x="9.5"
								y="2"
								width="5"
								height="5"
								rx="0.5"
								fill="#ff6900"
							/>
							<rect
								x="17"
								y="2"
								width="5"
								height="5"
								rx="0.5"
								fill="#fcb900"
							/>
							<rect
								x="2"
								y="9.5"
								width="5"
								height="5"
								rx="0.5"
								fill="#00d084"
							/>
							<rect
								x="9.5"
								y="9.5"
								width="5"
								height="5"
								rx="0.5"
								fill="#0693e3"
							/>
							<rect
								x="17"
								y="9.5"
								width="5"
								height="5"
								rx="0.5"
								fill="#9b51e0"
							/>
							<rect
								x="2"
								y="17"
								width="5"
								height="5"
								rx="0.5"
								fill="#0693e3"
							/>
							<rect
								x="9.5"
								y="17"
								width="5"
								height="5"
								rx="0.5"
								fill="#cf2e2e"
							/>
							<rect
								x="17"
								y="17"
								width="5"
								height="5"
								rx="0.5"
								fill="#00d084"
							/>
						</svg>
						<div className="telex-pixel-art-editor__text">
							<strong>
								{ __( 'Pixel Art Creator', 'pixel-art-creator' ) }
							</strong>
							<span>
								{ columns }{ ' ' }
								{ __( 'columns', 'pixel-art-creator' ) } &times;{ ' ' }
								{ rows } { __( 'rows', 'pixel-art-creator' ) }
							</span>
							<span className="telex-pixel-art-editor__hint">
								{ __(
									'Interactive painting grid on the frontend',
									'pixel-art-creator'
								) }
							</span>
						</div>
					</div>
					<div
						className="telex-pixel-art-editor__preview"
						style={ {
							gridTemplateColumns: `repeat(${ previewCols }, 1fr)`,
							gridTemplateRows: `repeat(${ previewRows }, 1fr)`,
						} }
					>
						{ previewCells.map( ( idx ) => (
							<span
								key={ idx }
								className="telex-pixel-art-editor__cell"
							/>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
