<template>
  <div class="row">
    <div class="col-md-12">
      <h1 class="pb-2 mb-2 border-bottom">{{ entity.name }}</h1>
      <b-alert variant="danger"
        dismissible
        :show="errors.has('general')">
      {{ errors.first('general') }}
      </b-alert>
    </div>
    <div class="col-md-12">
      <form style="margin-top: 20px;" @submit.prevent="validateBeforeSubmit">
          <input type="hidden" name="id" v-model="entity.id">
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label for="deviceType">Device type</label>
                    <select id="deviceType" name="deviceType" class="form-control" v-model="entity.deviceType">
                        <option value="RTLSDR">RTL-SDR</option>
                        <option value="PLUTOSDR">Pluto SDR</option>
                        <option value="LORAAT">LoRa-at</option>
                        <option value="LORAATBLE">LoRa-at BLE</option>
                        <option value="LORAATWIFI">LoRa-at WiFi</option>
                        <option value="SDRSERVER">sdr-server</option>
                        <option value="SPYSERVER">spyserver</option>
                    </select>
                    <small id="typeHelp" class="form-text text-muted">Each device has its own configuration</small>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <label for="minimumFrequency">Minimum frequency</label>
                <div class="input-group md-4">
                    <input type="text" id="minimumFrequency" name="minimumFrequency" :class="{'is-invalid': errors.has('minimumFrequency') }" v-validate="'required|integer'" class="form-control" v-model="entity.minimumFrequency">
                    <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2">Mhz</span>
                    </div>
                    <div class="invalid-feedback" v-if="errors.has('minimumFrequency')">{{ errors.first('minimumFrequency') }}</div>
                </div>
            </div>
            <div class="col-md-4">
                <label for="maximumFrequency">Maximum frequency</label>
                <div class="input-group md-4">
                    <input type="text" id="maximumFrequency" name="maximumFrequency" :class="{'is-invalid': errors.has('maximumFrequency') }" v-validate="'required|integer'" class="form-control" v-model="entity.maximumFrequency">
                    <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon3">Mhz</span>
                    </div>
                    <div class="invalid-feedback" v-if="errors.has('maximumFrequency')">{{ errors.first('maximumFrequency') }}</div>
                </div>
            </div>
        </div>
        <hr/>
        <div v-if="entity.deviceType == 'RTLSDR'">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('rtlDeviceId') }">
                      <label for="rtlDeviceId">Device index</label>
                      <input type="text" id="rtlDeviceId" name="rtlDeviceId" :class="{'is-invalid': errors.has('rtlDeviceId') }" v-validate="'required|integer'" class="form-control" v-model="entity.rtlDeviceId">
                      <div class="invalid-feedback" v-if="errors.has('rtlDeviceId')">{{ errors.first('rtlDeviceId') }}</div>
                      <small id="rtlDeviceIdHelp" class="form-text text-muted">If several rtl-sdr devices connected specify index here to distinguish them</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('gain') }">
                      <label for="gain">Gain</label>
                      <input type="text" id="gain" name="gain" :class="{'is-invalid': errors.has('gain') }" v-validate="'required|decimal'" class="form-control" v-model="entity.gain">
                      <div class="invalid-feedback" v-if="errors.has('gain')">{{ errors.first('gain') }}</div>
                      <small id="rtlDeviceIdHelp" class="form-text text-muted">Put 0 for AGC (Automatic gain control). Maximum is 49.6</small>
                    </div>
                </div>
            </div>   
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="gain">Bias-t enabled</label><br/>
                        <input class="form-control" type="checkbox" id="biast" v-model="entity.biast">
                        <small id="biast" class="form-text text-muted">
                            Will enable <a href="https://en.wikipedia.org/wiki/Bias_tee">bias-t</a> before every observation and disable afterwards
                        </small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                      <label for="ppm">PPM</label>
                      <input type="text" id="ppm" name="ppm" :class="{'is-invalid': errors.has('ppm') }" :readonly="ppmType === 'AUTO'" class="form-control" v-model="entity.ppm">
                      <div class="invalid-feedback" v-if="errors.has('ppm')">{{ errors.first('ppm') }}</div>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
        <div v-if="entity.deviceType == 'PLUTOSDR'">
            <div class="row">
                <div class="col-md-8">
                    <div class="form-group" :class="{'has-danger': errors.has('gain') }">
                      <label for="gain">Gain</label>
                      <input type="text" id="gain" name="gain" :class="{'is-invalid': errors.has('gain') }" v-validate="'required|decimal'" class="form-control" v-model="entity.gain">
                      <div class="invalid-feedback" v-if="errors.has('gain')">{{ errors.first('gain') }}</div>
                    </div>
                </div>
            </div>   
            <hr/>
        </div>
        <div v-if="entity.deviceType == 'LORAAT'">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('port') }">
                      <label for="port">Serial device</label>
                      <input type="text" id="port" name="port" :class="{'is-invalid': errors.has('port') }" v-validate="'required'" class="form-control" v-model="entity.port">
                      <div class="invalid-feedback" v-if="errors.has('port')">{{ errors.first('port') }}</div>
                      <small id="portHelp" class="form-text text-muted">Example: /dev/ttyUSB0</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('gain') }">
                      <label for="gain">Gain</label>
                      <input type="text" id="gain" name="gain" :class="{'is-invalid': errors.has('gain') }" v-validate="'required|decimal'" class="form-control" v-model="entity.gain">
                      <div class="invalid-feedback" v-if="errors.has('gain')">{{ errors.first('gain') }}</div>
                      <small id="portHelp" class="form-text text-muted">Supported values: 1,2,3,4,5,6,0. "0" is for automatic gain (AGC)</small>
                    </div>
                </div>
            </div>   
            <hr/>
        </div>
        <div v-if="entity.deviceType == 'LORAATBLE'">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('btaddress') }">
                      <label for="btaddress">Bluetooth address</label>
                      <input type="text" id="btaddress" name="btaddress" :class="{'is-invalid': errors.has('btaddress') }" v-validate="'required'" class="form-control" v-model="entity.btaddress">
                      <div class="invalid-feedback" v-if="errors.has('btaddress')">{{ errors.first('btaddress') }}</div>
                      <small id="portHelp" class="form-text text-muted">Example: 78:DD:08:A3:A7:52</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('gain') }">
                      <label for="gain">Gain</label>
                      <input type="text" id="gain" name="gain" :class="{'is-invalid': errors.has('gain') }" v-validate="'required|decimal'" class="form-control" v-model="entity.gain">
                      <div class="invalid-feedback" v-if="errors.has('gain')">{{ errors.first('gain') }}</div>
                      <small id="portHelp" class="form-text text-muted">Supported values: 1,2,3,4,5,6,0. "0" is for automatic gain (AGC)</small>
                    </div>
                </div>
            </div>   
            <div class="row">
                <div class="col-md-4">
                    <label for="minimumBatteryVoltage">Minimum battery voltage</label>
                    <div class="input-group md-4">
                        <input type="text" id="minimumBatteryVoltage" name="minimumBatteryVoltage" :class="{'is-invalid': errors.has('minimumBatteryVoltage') }" v-validate="'integer'" class="form-control" v-model="entity.minimumBatteryVoltage">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2">V</span>
                        </div>
                        <div class="invalid-feedback" v-if="errors.has('minimumBatteryVoltage')">{{ errors.first('minimumBatteryVoltage') }}</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="minimumBatteryVoltage">Maximum battery voltage</label>
                    <div class="input-group md-4">
                        <input type="text" id="maximumBatteryVoltage" name="maximumBatteryVoltage" :class="{'is-invalid': errors.has('maximumBatteryVoltage') }" v-validate="'integer'" class="form-control" v-model="entity.maximumBatteryVoltage">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2">V</span>
                        </div>
                        <div class="invalid-feedback" v-if="errors.has('maximumBatteryVoltage')">{{ errors.first('maximumBatteryVoltage') }}</div>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
        <div v-if="entity.deviceType == 'LORAATWIFI'">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('host') }">
                      <label for="host">Hostname</label>
                      <input type="text" id="host" name="host" :class="{'is-invalid': errors.has('host') }" v-validate="'required'" class="form-control" v-model="entity.host">
                      <div class="invalid-feedback" v-if="errors.has('host')">{{ errors.first('host') }}</div>
                      <small id="hostHelp" class="form-text text-muted">Example: lora-at.local</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('port') }">
                      <label for="port">Port</label>
                      <input type="text" id="port" name="port" :class="{'is-invalid': errors.has('port') }" v-validate="'required|integer'" class="form-control" v-model="entity.port">
                      <div class="invalid-feedback" v-if="errors.has('port')">{{ errors.first('port') }}</div>
                      <small id="portHelp" class="form-text text-muted">Example: 80</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('gain') }">
                      <label for="gain">Gain</label>
                      <input type="text" id="gain" name="gain" :class="{'is-invalid': errors.has('gain') }" v-validate="'required|decimal'" class="form-control" v-model="entity.gain">
                      <div class="invalid-feedback" v-if="errors.has('gain')">{{ errors.first('gain') }}</div>
                      <small id="portHelp" class="form-text text-muted">Supported values: 1,2,3,4,5,6,0. "0" is for automatic gain (AGC)</small>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('username') }">
                      <label for="username">Username</label>
                      <input type="text" id="username" name="username" :class="{'is-invalid': errors.has('username') }" v-validate="'required'" class="form-control" v-model="entity.username">
                      <div class="invalid-feedback" v-if="errors.has('username')">{{ errors.first('username') }}</div>
                      <small id="usernameHelp" class="form-text text-muted">Credentials to connect to lora-at</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('password') }">
                      <label for="password">Password</label>
                      <input type="password" id="password" name="password" :class="{'is-invalid': errors.has('password') }" v-validate="'required'" class="form-control" v-model="entity.password">
                      <div class="invalid-feedback" v-if="errors.has('password')">{{ errors.first('password') }}</div>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
        <div v-if="entity.deviceType == 'SDRSERVER'">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('host') }">
                      <label for="host">Hostname</label>
                      <input type="text" id="host" name="host" :class="{'is-invalid': errors.has('host') }" v-validate="'required'" class="form-control" v-model="entity.host">
                      <div class="invalid-feedback" v-if="errors.has('host')">{{ errors.first('host') }}</div>
                      <small id="hostHelp" class="form-text text-muted">Example: 127.0.0.1</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('port') }">
                      <label for="port">Port</label>
                      <input type="text" id="port" name="port" :class="{'is-invalid': errors.has('port') }" v-validate="'required|integer'" class="form-control" v-model="entity.port">
                      <div class="invalid-feedback" v-if="errors.has('port')">{{ errors.first('port') }}</div>
                      <small id="portHelp" class="form-text text-muted">Example: 8090</small>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <label for="bandwidth">Bandwidth</label>
                    <div class="input-group md-4">
                        <input type="text" id="bandwidth" name="bandwidth" :class="{'is-invalid': errors.has('bandwidth') }" v-validate="'required|integer'" class="form-control" v-model="entity.bandwidth">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">Mhz</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('bandwidth')"><small>{{ errors.first('bandwidth') }}</small></div>
                    <small id="bandwidthHelp" class="form-text text-muted">Total bandwidth as configured in sdr-server. Used in frequency bands calculation</small>
                </div>
                <div class="col-md-4">
                    <label for="bandwidthCrop">Bandwidth crop</label>
                    <div class="input-group md-4">
                        <input type="text" id="bandwidthCrop" name="bandwidthCrop" :class="{'is-invalid': errors.has('bandwidthCrop') }" v-validate="'required|integer'" class="form-control" v-model="entity.bandwidthCrop">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">hz</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('bandwidthCrop')"><small>{{ errors.first('bandwidthCrop') }}</small></div>
                    <small id="bandwidthCropHelp" class="form-text text-muted">RTL-SDR is not even across full bandwidth. Crop a little of bandwidth from both ends when calculating frequency bands</small>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('basepath') }">
                      <label for="basepath">Output directory</label>
                      <input type="text" id="basepath" name="basepath" :class="{'is-invalid': errors.has('basepath') }" v-validate="'required'" class="form-control" v-model="entity.basepath">
                      <div class="invalid-feedback" v-if="errors.has('basepath')">{{ errors.first('basepath') }}</div>
                      <small id="basepathHelp" class="form-text text-muted">Location where sdr-server put iq data. Take from sdr-server configuration</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('usegzip') }">
                      <label for="usegzip">Use GZIP</label><br/>
                      <input class="form-control" type="checkbox" id="usegzip" v-model="entity.usegzip">
                      <div class="invalid-feedback" v-if="errors.has('usegzip')">{{ errors.first('usegzip') }}</div>
                      <small id="usegzipHelp" class="form-text text-muted">sdr-server can save IQ files gzipped</small>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
        <div v-if="entity.deviceType == 'SPYSERVER'">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('host') }">
                      <label for="host">Hostname</label>
                      <input type="text" id="host" name="host" :class="{'is-invalid': errors.has('host') }" v-validate="'required'" class="form-control" v-model="entity.host">
                      <div class="invalid-feedback" v-if="errors.has('host')">{{ errors.first('host') }}</div>
                      <small id="hostHelp" class="form-text text-muted">Example: 127.0.0.1</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('port') }">
                      <label for="port">Port</label>
                      <input type="text" id="port" name="port" :class="{'is-invalid': errors.has('port') }" v-validate="'required|integer'" class="form-control" v-model="entity.port">
                      <div class="invalid-feedback" v-if="errors.has('port')">{{ errors.first('port') }}</div>
                      <small id="portHelp" class="form-text text-muted">Example: 5555</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('gain') }">
                      <label for="gain">Gain</label>
                      <input type="text" id="gain" name="gain" :class="{'is-invalid': errors.has('gain') }" v-validate="'required|decimal'" class="form-control" v-model="entity.gain">
                      <div class="invalid-feedback" v-if="errors.has('gain')">{{ errors.first('gain') }}</div>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label for="antennaType">Antenna type</label>
                    <select id="antennaType" name="antenna.antennaType" class="form-control" v-model="entity.antenna.antennaType">
                        <option value="DIRECTIONAL">Directional</option>
                        <option value="OMNIDIRECTIONAL">Omnidirectional</option>
                        <option value="FIXED_DIRECTIONAL">Fixed directional</option>
                    </select>
                </div>
            </div>
        </div>
        <div v-if="entity.antenna.antennaType == 'DIRECTIONAL' || (entity.antenna.antennaType == 'OMNIDIRECTIONAL')">
            <div class="row">
                <div class="col-md-4">
                    <label for="minElevation">Minimum elevation</label>
                    <div class="input-group md-4">
                        <input type="text" id="minElevation" name="antenna.minElevation" :class="{'is-invalid': errors.has('antenna.minElevation') }" v-validate="'required|decimal'" class="form-control" v-model="entity.antenna.minElevation">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">degrees</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('antenna.minElevation')"><small>{{ errors.first('antenna.minElevation') }}</small></div>
                    <small id="minElevationHelp" class="form-text text-muted">Start and end observations when satellites at this elevation</small>
                </div>
                <div class="col-md-4">
                    <label for="guaranteedElevation">Guaranteed elevation</label>
                    <div class="input-group md-4">
                        <input type="text" id="guaranteedElevation" name="antenna.guaranteedElevation" :class="{'is-invalid': errors.has('antenna.guaranteedElevation') }" v-validate="'required|decimal'" class="form-control" v-model="entity.antenna.guaranteedElevation">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">degrees</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('antenna.guaranteedElevation')"><small>{{ errors.first('antenna.guaranteedElevation') }}</small></div>
                    <small id="guaranteedElevationHelp" class="form-text text-muted">Schedule observations where satellites reach at least this elevation</small>
                </div>
            </div>
            <hr/>
        </div>
        <div v-if="entity.antenna.antennaType == 'FIXED_DIRECTIONAL'">
            <div class="row">
                <div class="col-md-4">
                    <label for="azimuth">Azimuth</label>
                    <div class="input-group md-4">
                        <input type="text" id="azimuth" name="antenna.azimuth" :class="{'is-invalid': errors.has('antenna.azimuth') }" v-validate="'required|decimal'" class="form-control" v-model="entity.antenna.azimuth">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">degrees</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('antenna.azimuth')"><small>{{ errors.first('antenna.azimuth') }}</small></div>
                    <small id="azimuthHelp" class="form-text text-muted">Azimuth where antenna is pointing. "0" degrees is North and going clockwise</small>
                </div>
                <div class="col-md-4">
                    <label for="elevation">Elevation</label>
                    <div class="input-group md-4">
                        <input type="text" id="elevation" name="antenna.elevation" :class="{'is-invalid': errors.has('antenna.elevation') }" v-validate="'required|decimal'" class="form-control" v-model="entity.antenna.elevation">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">degrees</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('antenna.elevation')"><small>{{ errors.first('antenna.elevation') }}</small></div>
                    <small id="elevationHelp" class="form-text text-muted">Elevation where antenna is pointing. Minimum is "0" degrees, maximum is "90"</small>
                </div>
                <div class="col-md-4">
                    <label for="beamwidth">Beamwidth</label>
                    <div class="input-group md-4">
                        <input type="text" id="beamwidth" name="antenna.beamwidth" :class="{'is-invalid': errors.has('antenna.beamwidth') }" v-validate="'required|decimal'" class="form-control" v-model="entity.antenna.beamwidth">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">degrees</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('antenna.beamwidth')"><small>{{ errors.first('antenna.beamwidth') }}</small></div>
                    <small id="beamwidthHelp" class="form-text text-muted">Approximate beamwidth of antenna. Used to calculate the field of view</small>
                </div>
            </div>
            <hr/>
        </div>
        <div v-if="entity.antenna.antennaType == 'DIRECTIONAL'">
            <div class="row">
                <div class="col-md-8">
                    <h3>Rotator configuration</h3>
                    <p>Before configuring rotator make sure <a href="https://manpages.ubuntu.com/manpages/xenial/en/man8/rotctld.8.html">rotctrld</a> daemon is running.</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('rotator.rotctrldHostname') }">
                        <label for="rotctrldHostname">Hostname</label>
                        <input type="text" id="rotctrldHostname" name="rotator.rotctrldHostname" :class="{'is-invalid': errors.has('rotator.rotctrldHostname') }" class="form-control" v-model="entity.rotator.rotctrldHostname">
                        <div class="invalid-feedback" v-if="errors.has('rotator.rotctrldHostname')">{{ errors.first('rotator.rotctrldHostname') }}</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group" :class="{'has-danger': errors.has('rotator.rotctrldPort') }">
                        <label for="rotctrldPort">Port</label>
                        <input type="text" id="rotctrldPort" name="rotator.rotctrldPort" :class="{'is-invalid': errors.has('rotator.rotctrldPort') }" v-validate="'integer'" class="form-control" v-model="entity.rotator.rotctrldPort">
                        <div class="invalid-feedback" v-if="errors.has('rotator.rotctrldPort')">{{ errors.first('rotator.rotctrldPort') }}</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <label for="rotatorTolerance">Tolerance</label>
                    <div class="input-group md-4">
                        <input type="text" id="rotatorTolerance" name="rotator.rotatorTolerance" :class="{'is-invalid': errors.has('rotator.rotatorTolerance') }" v-validate="'decimal'" class="form-control" v-model="entity.rotator.rotatorTolerance">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">degrees</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('rotator.rotatorTolerance')"><small>{{ errors.first('rotator.rotatorTolerance') }}</small></div>
                    <small id="rotatorToleranceHelp" class="form-text text-muted">Defines how far antenna can be behind or ahead of satellite when tracking</small>
                </div>
                <div class="col-md-4">
                    <label for="rotatorCycle">Update interval</label>
                    <div class="input-group md-4">
                        <input type="text" id="rotatorCycle" name="rotator.rotatorCycle" :class="{'is-invalid': errors.has('rotator.rotatorCycle') }" class="form-control" v-model="entity.rotator.rotatorCycle">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon3">ms</span>
                        </div>
                    </div>
                    <div class="text-danger" v-if="errors.has('rotator.rotatorCycle')"><small>{{ errors.first('rotator.rotatorCycle') }}</small></div>
                    <small id="rotatorCycleHelp" class="form-text text-muted">How frequently rotator should be updated</small>
                </div>
            </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="submitting">Save</button>
        <span v-if="success" class="text-success" style="margin-left: 20px;">Saved</span>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'general',
  data() {
    return { 
      entity: {
        antenna: {
          antennaType: "OMNIDIRECTIONAL"
        },
        rotator: {}
      },
      success: false,
      submitting: false
    }
  },
  mounted () {
    const vm = this
    if( !vm.$route.query.id ) {
      return
    }
    vm.$http.get('/admin/device/config/load', { params: { id: vm.$route.query.id } } ).then(function (response) {
      if( !response.data.rotator ) {
        response.data.rotator = {}
      }
      vm.entity = response.data
    })
  },
  methods: {
    validateBeforeSubmit (e) {
      this.$validator.errors.clear()
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.submit()
        }
      })
    },
    submit: function (event) {
      if (this.submitting) {
        return
      }
      this.success = false
      this.submitting = true
      const vm = this
      vm.$http.post('/admin/device/config/save', vm.entity).then(function (response) {
        vm.submitting = false
        vm.success = true
      }).catch(function (error) {
        vm.submitting = false
        vm.handleError(vm, error)
      })
    }
  }
}
</script>
