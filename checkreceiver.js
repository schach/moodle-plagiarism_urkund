// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Javascript helper function for URKUND plugin
 *
 * @package   plagiarism-urkund
 * @copyright 2014 Dan Marsden <Dan@danmarsden.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

M.plagiarism_urkund = {};

M.plagiarism_urkund.init = function(Y, contextid) {

    var check_urkund_receiver = function(Y, receiver, contextid) {
        var rval = receiver.get('value');
        var parentdiv = receiver.ancestor('div');
        var url = M.cfg.wwwroot + '/plagiarism/urkund/checkreceiver.php';
        var valid = '<span id="receivervalid" class="pathok">&#x2714;</span>';
        var invalid = '<span id="receivervalid" class="patherror">&#x2718;</span>';
        var config = {
            method: 'get',
            context: this,
            sync: false,
            data : {
                'sesskey' : M.cfg.sesskey,
                'ur' : rval,
                'c' : contextid
            },
            on: {
                success: function(tid, response) {
                    var jsondata = Y.JSON.parse(response.responseText);
                    var existing = Y.one('#receivervalid');

                    if (String(jsondata) === 'true') {
                        if (existing) {
                            existing.replace(valid);
                        } else {
                            receiver.insert(valid, 'after');

                        }
                        // Remove error from form
                        parentdiv.removeClass('error');
                        // Remove error span
                        parentdiv.one('.error').remove();
                    } else {
                        if (existing) {
                            existing.replace(invalid);
                        } else {
                            receiver.insert(invalid, 'after');
                        }
                    }
                },
                failure: function(tid, response) {
                    receiver.insert(invalid, 'after');
                }
            }
        };
        Y.io(url, config)
    }

    var receiver = Y.one('#id_urkund_receiver');
    // Validate existing content.
    check_urkund_receiver(Y, receiver, contextid);
    // Validate on change.
    receiver.on('change', function(e) {
        check_urkund_receiver(Y, receiver, contextid);
    })
}