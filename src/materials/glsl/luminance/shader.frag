#include <common>

uniform sampler2D inputBuffer;
uniform float distinction;
uniform vec2 range;

varying vec2 vUv;

float linearToWeightedLuminance( const in vec3 color ) {
	// max out red component since we dont need it
	vec3 weights = vec3( 1.0, 0.7152, 0.0722 );

	// ignore red
	float ratioRed = smoothstep(0.0, 0.99, color.r);
	float ratioGreen = smoothstep(0.0, 0.99, color.g);
	float ratioBlue = smoothstep(0.0, 0.99, color.b);

	float ratio = ratioRed * ratioGreen * ratioBlue;

	// invert the ratio
	ratio = 1.0 - ratio;

	float luminance = mix(0.0, dot( weights, color.rgb ), ratio);

	return luminance;
}

void main() {

	vec4 texel = texture2D(inputBuffer, vUv);
	float l = linearToWeightedLuminance(texel.rgb);

	#ifdef RANGE

		float low = step(range.x, l);
		float high = step(l, range.y);

		// Apply the mask.
		l *= low * high;

	#endif

	l = pow(abs(l), distinction);

	#ifdef COLOR

		gl_FragColor = vec4(texel.rgb * l, texel.a);

	#else

		gl_FragColor = vec4(l, l, l, texel.a);

	#endif

}
