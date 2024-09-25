import React, { useState } from 'react';
import Tag from './Tag';

const universities = [
    { name: 'Northeastern', nicknames: ['NU', 'NEU', 'northeastern', 'neu', 'nu', 'NORTHEASTERN', 'Northeastern'] },
    { name: 'Stanford', nicknames: ['stanford', 'STANFORD', 'Stanford'] },
    { name: 'Yale', nicknames: ['yale', 'YALE'] },
    { name: 'UCLA', nicknames: ['ucla', 'University of California Los Angeles', 'University Of California Los Angeles', 'university of california los angeles', 'UCLA'] },
    { name: 'Massachusetts Institute of Technology', nicknames: ['MIT', 'mit.edu'] },
    { name: 'Harvard University', nicknames: ['harvard', 'harvard.edu', 'Harvard'] },
    { name: 'Princeton University', nicknames: ['princeton', 'princeton.edu', 'Princeton'] },
    { name: 'California Institute of Technology', nicknames: ['Caltech', 'caltech.edu'] },
    { name: 'University of California, Berkeley', nicknames: ['berkeley', 'berkeley.edu', 'ucb'] },
    { name: 'University of Chicago', nicknames: ['uchicago', 'uchicago.edu'] },
    { name: 'Johns Hopkins University', nicknames: ['jhu', 'jhu.edu'] },
    { name: 'University of Pennsylvania', nicknames: ['upenn', 'upenn.edu'] },
    { name: 'Columbia University', nicknames: ['columbia', 'columbia.edu'] },
    { name: 'Cornell University', nicknames: ['cornell', 'cornell.edu'] },
    { name: 'University of Michigan-Ann Arbor', nicknames: ['umich', 'umich.edu'] },
    { name: 'Carnegie Mellon University', nicknames: ['cmu', 'cmu.edu'] },
    { name: 'University of Washington', nicknames: ['washington', 'washington.edu'] },
    { name: 'Duke University', nicknames: ['duke', 'duke.edu'] },
    { name: 'Northwestern University', nicknames: ['northwestern', 'northwestern.edu'] },
    { name: 'Brown University', nicknames: ['brown', 'brown.edu'] },
    { name: 'University of Notre Dame', nicknames: ['notredame', 'notredame.edu'] },
    { name: 'Vanderbilt University', nicknames: ['vanderbilt', 'vanderbilt.edu'] },
    { name: 'Dartmouth College', nicknames: ['dartmouth', 'dartmouth.edu'] },
    { name: 'Rice University', nicknames: ['rice', 'rice.edu'] },
    { name: 'Emory University', nicknames: ['emory', 'emory.edu'] },
    { name: 'University of North Carolina at Chapel Hill', nicknames: ['unc', 'unc.edu'] },
    { name: 'Washington University in St. Louis', nicknames: ['wustl', 'wustl.edu'] },
    { name: 'Georgetown University', nicknames: ['georgetown', 'georgetown.edu'] },
    { name: 'University of Southern California', nicknames: ['usc', 'usc.edu'] },
    { name: 'University of Texas at Austin', nicknames: ['ut', 'universityoftexas.edu'] },
    { name: 'University of Wisconsin-Madison', nicknames: ['uwmad', 'uwmad.wisc.edu'] },
    { name: 'University of Virginia', nicknames: ['uva', 'universityofvirginia.edu'] },
    { name: 'New York University', nicknames: ['nyu', 'nyu.edu'] },
    { name: 'Tufts University', nicknames: ['tufts', 'tufts.edu'] },
    { name: 'University of Florida', nicknames: ['uf', 'universityofflorida.edu'] },
    { name: 'University of Miami', nicknames: ['miami', 'universityofmiami.edu'] },
    { name: 'Boston College', nicknames: ['bostoncollege', 'bostoncollege.edu'] },
    { name: 'University of California, Davis', nicknames: ['ucdavis', 'ucdavis.edu'] },
    { name: 'University of Delaware', nicknames: ['udel', 'udel.edu'] },
    { name: 'Georgia Institute of Technology', nicknames: ['gatech', 'gatech.edu'] },
    { name: 'Rensselaer Polytechnic Institute', nicknames: ['rpi', 'rpi.edu'] },
    { name: 'Case Western Reserve University', nicknames: ['case', 'case.edu'] },
    { name: 'University of California, San Diego', nicknames: ['ucsd', 'ucsd.edu'] },
    { name: 'University of California, Santa Barbara', nicknames: ['ucsb', 'ucsb.edu'] },
    { name: 'University of Massachusetts Amherst', nicknames: ['umass', 'umass.edu'] },
    { name: 'Michigan State University', nicknames: ['msu', 'msu.edu'] },
    { name: 'Ohio State University', nicknames: ['osu', 'osu.edu'] },
    { name: 'Purdue University', nicknames: ['purdue', 'purdue.edu'] },
    { name: 'University of Illinois at Urbana-Champaign', nicknames: ['uiuc', 'uiuc.edu'] },
    { name: 'Texas A&M University', nicknames: ['tamu', 'tamu.edu'] },
    { name: 'University of Maryland', nicknames: ['umd', 'umd.edu'] },
    { name: 'Clemson University', nicknames: ['clemson', 'clemson.edu'] },
    { name: 'Rutgers University', nicknames: ['rutgers', 'rutgers.edu'] },
    { name: 'Pennsylvania State University', nicknames: ['psu', 'psu.edu'] },
    { name: 'University of South Florida', nicknames: ['usf', 'usf.edu'] },
    { name: 'Boston University', nicknames: ['bu', 'bu.edu'] },
    { name: 'University of Georgia', nicknames: ['uga', 'uga.edu'] },
    { name: 'Indiana University Bloomington', nicknames: ['indiana', 'indiana.edu'] },
    { name: 'University of Tennessee', nicknames: ['utk', 'utk.edu'] },
    { name: 'Auburn University', nicknames: ['auburn', 'auburn.edu'] },
    { name: 'Oklahoma State University', nicknames: ['okstate', 'okstate.edu'] },
    { name: 'Texas State University', nicknames: ['txstate', 'txstate.edu'] },
    { name: 'University of Mississippi', nicknames: ['olemiss', 'olemiss.edu'] },
    { name: 'Wayne State University', nicknames: ['wayne', 'wayne.edu'] },
    { name: 'King\'s College London', nicknames: ['kcl', 'kcl.ac.uk'] },
    { name: 'University of Oxford', nicknames: ['oxford', 'ox.ac.uk'] },
    { name: 'University of Cambridge', nicknames: ['cambridge', 'cam.ac.uk'] },
    { name: 'Imperial College London', nicknames: ['imperial', 'imperial.ac.uk'] },
    { name: 'London School of Economics', nicknames: ['lse', 'lse.ac.uk'] },
    { name: 'University College London', nicknames: ['ucl', 'ucl.ac.uk'] },
    { name: 'University of Edinburgh', nicknames: ['edinburgh', 'ed.ac.uk'] },
    { name: 'University of Manchester', nicknames: ['manchester', 'manchester.ac.uk'] },
    { name: 'University of Warwick', nicknames: ['warwick', 'warwick.ac.uk'] },
    { name: 'University of Glasgow', nicknames: ['glasgow', 'glasgow.ac.uk'] },
    { name: 'University of Bristol', nicknames: ['bristol', 'bristol.ac.uk'] },
    { name: 'Durham University', nicknames: ['durham', 'durham.ac.uk'] },
    { name: 'University of Sheffield', nicknames: ['sheffield', 'sheffield.ac.uk'] },
    { name: 'University of Birmingham', nicknames: ['birmingham', 'bham.ac.uk'] },
    { name: 'University of Exeter', nicknames: ['exeter', 'exeter.ac.uk'] },
    { name: 'University of York', nicknames: ['york', 'york.ac.uk'] },
    { name: 'University of Nottingham', nicknames: ['nottingham', 'nottingham.ac.uk'] },
    { name: 'Queen\'s University Belfast', nicknames: ['qub', 'qub.ac.uk'] },
    { name: 'University of Sussex', nicknames: ['sussex', 'sussex.ac.uk'] },
    { name: 'KU Leuven', nicknames: ['kuleuven', 'kuleuven.be'] },
    { name: 'ETH Zurich', nicknames: ['ethz', 'ethz.ch'] },
    { name: 'EPFL', nicknames: ['epfl', 'epfl.ch'] },
    { name: 'University of Helsinki', nicknames: ['helsinki', 'helsinki.fi'] },
    { name: 'Trinity College Dublin', nicknames: ['tcd', 'tcd.ie'] },
    { name: 'University of Copenhagen', nicknames: ['copenhagen', 'ku.dk'] },
    { name: 'University of Vienna', nicknames: ['vienna', 'univie.ac.at'] },
    { name: 'University of Lausanne', nicknames: ['lausanne', 'unil.ch'] },
    { name: 'Politecnico di Milano', nicknames: ['polimi', 'polimi.it'] },
    { name: 'University of Bologna', nicknames: ['unibo', 'unibo.it'] },
    { name: 'Sciences Po', nicknames: ['sciencespo', 'sciencespo.fr'] },
    { name: 'Sorbonne University', nicknames: ['sorbonne', 'sorbonne-universite.fr'] },
    { name: 'Lund University', nicknames: ['lund', 'lu.se'] },
    { name: 'Ghent University', nicknames: ['ugent', 'ugent.be'] },
    { name: 'TU Dresden', nicknames: ['tudresden', 'tu-dresden.de'] },
    { name: 'TU Berlin', nicknames: ['tuberlin', 'tu-berlin.de'] },
    { name: 'Technical University of Munich', nicknames: ['tum', 'tum.de'] },
    { name: 'Karlsruhe Institute of Technology', nicknames: ['kit', 'kit.edu'] },
    { name: 'University of Heidelberg', nicknames: ['heidelberg', 'uni-heidelberg.de'] },
    { name: 'University of Mannheim', nicknames: ['mannheim', 'uni-mannheim.de'] },
    { name: 'University of Munich', nicknames: ['munich', 'uni-muenchen.de'] },
    { name: 'University of Freiburg', nicknames: ['freiburg', 'uni-freiburg.de'] },
    { name: 'University of Tuebingen', nicknames: ['tuebingen', 'uni-tuebingen.de'] },
    { name: 'University of Geneva', nicknames: ['geneva', 'unige.ch'] },
    { name: 'University of Basel', nicknames: ['basel', 'unibas.ch'] },
    { name: 'Delft University of Technology', nicknames: ['delft', 'tu-delft.nl'] },
    { name: 'University of Amsterdam', nicknames: ['amsterdam', 'uva.nl'] },
    { name: 'Utrecht University', nicknames: ['utrecht', 'uu.nl'] },
    { name: 'University of Groningen', nicknames: ['groningen', 'rug.nl'] },
    { name: 'University College Dublin', nicknames: ['ucd', 'ucd.ie'] },
    { name: 'National University of Ireland Galway', nicknames: ['nuigalway', 'nuigalway.ie'] },
    { name: 'University of New South Wales', nicknames: ['unsw', 'usw.edu.au'] },
    { name: 'University of Queensland', nicknames: ['uq', 'uq.edu.au'] },
    { name: 'University of Melbourne', nicknames: ['unimelb', 'unimelb.edu.au'] },
    { name: 'University of Tasmania', nicknames: ['utas', 'utas.edu.au'] },
    { name: 'Australian National University', nicknames: ['anu', 'anu.edu.au'] },
    { name: 'University of Adelaide', nicknames: ['adelaide', 'adelaide.edu.au'] },
    { name: 'Curtin University', nicknames: ['curtin', 'curtin.edu.au'] },
    { name: 'Monash University', nicknames: ['monash', 'monash.edu.au'] },
    { name: 'Deakin University', nicknames: ['deakin', 'deakin.edu.au'] },
    { name: 'Griffith University', nicknames: ['griffith', 'griffith.edu.au'] },
    { name: 'La Trobe University', nicknames: ['latrobe', 'latrobe.edu.au'] },
    { name: 'University of South Australia', nicknames: ['unisa', 'unisa.edu.au'] },
    { name: 'University of Sydney', nicknames: ['sydney', 'sydney.edu.au'] },
    { name: 'National University of Singapore', nicknames: ['nus', 'nus.edu.sg'] },
    { name: 'Nanyang Technological University', nicknames: ['ntu', 'ntu.edu.sg'] },
    { name: 'Singapore Management University', nicknames: ['smu', 'smu.edu.sg'] },
    { name: 'Singapore University of Social Sciences', nicknames: ['suss', 'suss.edu.sg'] },
    { name: 'Singapore Institute of Technology', nicknames: ['sit', 'sit.edu.sg'] },
    { name: 'Singapore University of Technology and Design', nicknames: ['sutd', 'sutd.edu.sg'] },
    { name: 'National Institute of Education', nicknames: ['nist', 'nist.edu.sg'] },
    { name: 'Ngee Ann Polytechnic', nicknames: ['np', 'np.edu.sg'] },
    { name: 'Singapore Polytechnic', nicknames: ['sp', 'sp.edu.sg'] },
    { name: 'Republic Polytechnic', nicknames: ['rp', 'rp.edu.sg'] },
    { name: 'University at Albany, SUNY', nicknames: ['albany', 'albany.edu'] },
    { name: 'Binghamton University, SUNY', nicknames: ['binghamton', 'binghamton.edu'] },
    { name: 'University at Buffalo, SUNY', nicknames: ['buffalo', 'buffalo.edu'] },
    { name: 'Stony Brook University, SUNY', nicknames: ['stonybrook', 'stonybrook.edu'] },
    { name: 'SUNY Buffalo State', nicknames: ['buffalostate', 'buffalostate.edu'] },
    { name: 'University Of California Irvine', nicknames: ['uci', 'uci.edu'] },
    { name: 'University Of California Riverside', nicknames: ['ucr', 'ucr.edu'] },
    { name: 'University Of California Santa Cruz', nicknames: ['ucsc', 'ucsc.edu'] },
    { name: 'University Of California Merced', nicknames: ['ucmerced', 'ucmerced.edu'] },
    { name: 'University of Toronto', nicknames: ['toronto', 'mail.utoronto.ca'] },
    { name: 'University of British Columbia', nicknames: ['ubc', 'student.ubc.ca'] },
    { name: 'McGill University', nicknames: ['mcgill', 'mail.mcgill.ca'] },
    { name: 'McMaster University', nicknames: ['mcmaster', 'mail.mcmaster.ca'] },
    { name: 'University of Alberta', nicknames: ['ualberta', 'ualberta.ca'] },
    { name: 'Université de Montréal', nicknames: ['umontreal', 'umontreal.ca'] },
    { name: 'University of Waterloo', nicknames: ['waterloo', 'uwaterloo.ca'] },
    { name: 'Western University', nicknames: ['western', 'uwo.ca'] },
    { name: 'University of Ottawa', nicknames: ['ottawa', 'uottawa.ca'] },
    { name: 'Simon Fraser University', nicknames: ['sfu', 'sfu.ca'] },
    { name: 'Dalhousie University', nicknames: ['dal', 'dal.ca'] },
    { name: 'Université Laval', nicknames: ['ulaval', 'ulaval.ca'] },
    { name: 'University of Victoria', nicknames: ['uvic', 'uvic.ca'] },
    { name: 'Concordia University', nicknames: ['concordia', 'mail.concordia.ca'] },
    { name: 'Carleton University', nicknames: ['carleton', 'carleton.ca'] },
    { name: 'Virginia Tech', nicknames: ['vt', 'vt.edu'] },
    { name: 'SUNY Farmingdale', nicknames: ['farmingdale', 'farmingdale.edu'] }
];


const Filter: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setInput(value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            if (tags.length >= 5) {
                alert('Filter limit reached');
                return;
            }

            if (input.length > 50) {
                alert('Input should be 50 characters or less');
                return;
            }

            if (tags.includes(input)) {
                alert('Filter has already been added');
                return;
            }

            setTags([...tags, input]);
            setInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };



    return (
        <>
            <div className="container-fluid d-flex justify-content-center align-items-center">
                <div className="p-3" style={{ color: '#FFFFFF', marginTop: '-30vh' }}>
                  <h3 className="start-chatting text-center mb-10" style={{ fontSize: '44px', fontWeight: '900', fontFamily: 'Josefin Sans' }}>
  Add <span style={{
    backgroundImage: 'linear-gradient(90deg, #00fff0, #ff00f5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    paddingTop: 30,
  }}>filters</span> to customize your experience
</h3>

                    <div className="justify-content-center align-items-center">
                        <input
                            type="text"
                            className="form-control w-auto bg-white text-black rounded-lg p-2 text-left align-top"
                            placeholder="Add interests (optional)"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            style={{ backgroundColor: 'white', color: 'black', width: '550px', height: '55px', borderRadius: '0.5rem' }}
                        />
                    </div>

                    {tags.length > 0 && (
                        <div className="text-center mt-4">
                            <strong></strong>
                            <div className="d-flex flex-wrap justify-content-center mt-2">
                                {tags.map(tag => {
                                    const isUni = universities.some(uni => uni.nicknames.includes(tag));
                                    return <Tag key={tag} label={tag} isUniversity={isUni} onRemove={handleRemoveTag} />;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Filter;
